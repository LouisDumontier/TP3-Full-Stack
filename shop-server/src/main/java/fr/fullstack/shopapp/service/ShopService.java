package fr.fullstack.shopapp.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.fullstack.shopapp.model.Product;
import fr.fullstack.shopapp.model.Shop;
import fr.fullstack.shopapp.repository.ShopRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.Predicate;

@Service
public class ShopService {
    @PersistenceContext
    private EntityManager em;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ElasticSearchService elasticSearchService;

    @Transactional
    public Shop createShop(Shop shop) throws Exception {
        try {
            Shop newShop = shopRepository.save(shop);
            // Refresh the entity after the save. Otherwise, @Formula does not work.
            em.flush();
            em.refresh(newShop);
            return newShop;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public void deleteShopById(long id) throws Exception {
        try {
            Shop shop = getShop(id);
            // delete nested relations with products
            deleteNestedRelations(shop);
            shopRepository.deleteById(id);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public Shop getShopById(long id) throws Exception {
        try {
            return getShop(id);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // public Page<Shop> getShopList(
    // Optional<String> sortBy,
    // Optional<Boolean> inVacations,
    // Optional<String> createdBefore,
    // Optional<String> createdAfter,
    // Optional<String> label,
    // Pageable pageable) {

    // // SORT
    // if (sortBy.isPresent()) {
    // return switch (sortBy.get()) {
    // case "name" -> shopRepository.findByOrderByNameAsc(pageable);
    // case "createdAt" -> shopRepository.findByOrderByCreatedAtAsc(pageable);
    // default -> shopRepository.findByOrderByNbProductsAsc(pageable);
    // };
    // }

    // // FILTERS
    // Page<Shop> shopList = getShopListWithFilter(inVacations, createdBefore,
    // createdAfter, label, pageable);
    // if (shopList != null) {
    // return shopList;
    // }

    // // NONE
    // return shopRepository.findByOrderByIdAsc(pageable);
    // }

    public Page<Shop> getShopList(
            Optional<String> sortBy,
            Optional<Boolean> inVacations,
            Optional<String> createdBefore,
            Optional<String> createdAfter,
            Optional<String> label,
            Pageable pageable) {

        if (label.isPresent()) {
            Pageable searchPageable = pageable;
            if (sortBy.isPresent()) {
                String[] sortParts = sortBy.get().split(",");
                String field = sortParts[0];
                Sort.Direction direction = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;
                searchPageable = PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        Sort.by(direction, field));
            }
            Page<Shop> elasticResults = elasticSearchService.searchShops(label.get(), searchPageable);
            System.out.println("Elastic Results : " + elasticResults.getContent().size() + " for label " + label.get());

            List<Shop> filteredResults = elasticResults.getContent().stream()
                    .filter(shop -> inVacations.isEmpty() || shop.getInVacations() == (inVacations.get()))
                    .filter(shop -> createdAfter.isEmpty() ||
                            !shop.getCreatedAt().isBefore(LocalDate.parse(createdAfter.get())))
                    .filter(shop -> createdBefore.isEmpty() ||
                            !shop.getCreatedAt().isAfter(LocalDate.parse(createdBefore.get())))
                    .toList();

            return new PageImpl<>(filteredResults, pageable, elasticResults.getTotalElements());
        }

        Specification<Shop> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (inVacations.isPresent()) {
                predicates.add(inVacations.get()
                        ? cb.isTrue(root.get("inVacations"))
                        : cb.isFalse(root.get("inVacations")));
            }

            if (createdBefore.isPresent()) {
                LocalDate ld = LocalDate.parse(createdBefore.get());
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), ld));
            }

            if (createdAfter.isPresent()) {
                LocalDate ld = LocalDate.parse(createdAfter.get());
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), ld));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable finalPageable = pageable;
        if (sortBy.isPresent()) {
            String[] sortParts = sortBy.get().split(",");
            String field = sortParts[0];
            Sort.Direction direction = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc")
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            finalPageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(direction, field));
        }

        return shopRepository.findAll(spec, finalPageable);
    }

    @Transactional
    public Shop updateShop(Shop shop) throws Exception {
        try {
            getShop(shop.getId());
            return this.createShop(shop);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    private void deleteNestedRelations(Shop shop) {
        List<Product> products = shop.getProducts();
        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            product.setShop(null);
            em.merge(product);
            em.flush();
        }
    }

    private Shop getShop(Long id) throws Exception {
        Optional<Shop> shop = shopRepository.findById(id);
        if (!shop.isPresent()) {
            throw new Exception("Shop with id " + id + " not found");
        }
        return shop.get();
    }

    private Page<Shop> getShopListWithFilter(
            Optional<Boolean> inVacations,
            Optional<String> createdAfter,
            Optional<String> createdBefore,
            Optional<String> label,
            Pageable pageable) {

        // If label is present, use Hibernate Search
        if (label.isPresent()) {
            Page<Shop> allResults = elasticSearchService.searchShops(label.get(), pageable);

            // Apply other filters manually
            List<Shop> filteredResults = allResults.stream()
                    .filter(shop -> inVacations.isEmpty() || shop.getInVacations() == inVacations.get())
                    .filter(shop -> createdAfter.isEmpty() ||
                            !shop.getCreatedAt().isBefore(LocalDate.parse(createdAfter.get())))
                    .filter(shop -> createdBefore.isEmpty() ||
                            !shop.getCreatedAt().isAfter(LocalDate.parse(createdBefore.get())))
                    .toList();

            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), filteredResults.size());

            List<Shop> paginatedResults = filteredResults.subList(
                    Math.min(start, filteredResults.size()),
                    end);

            return new PageImpl<>(paginatedResults, pageable, filteredResults.size());
        }

        if (inVacations.isPresent() && createdBefore.isPresent() && createdAfter.isPresent()) {
            return shopRepository.findByInVacationsAndCreatedAtGreaterThanAndCreatedAtLessThan(
                    inVacations.get(),
                    LocalDate.parse(createdAfter.get()),
                    LocalDate.parse(createdBefore.get()),
                    pageable);
        }
        if (inVacations.isPresent() && createdBefore.isPresent()) {
            return shopRepository.findByInVacationsAndCreatedAtLessThan(
                    inVacations.get(), LocalDate.parse(createdBefore.get()), pageable);
        }
        if (inVacations.isPresent() && createdAfter.isPresent()) {
            return shopRepository.findByInVacationsAndCreatedAtGreaterThan(
                    inVacations.get(), LocalDate.parse(createdAfter.get()), pageable);
        }
        if (inVacations.isPresent()) {
            return shopRepository.findByInVacations(inVacations.get(), pageable);
        }
        if (createdBefore.isPresent() && createdAfter.isPresent()) {
            return shopRepository.findByCreatedAtBetween(
                    LocalDate.parse(createdAfter.get()), LocalDate.parse(createdBefore.get()), pageable);
        }
        if (createdBefore.isPresent()) {
            return shopRepository.findByCreatedAtLessThan(
                    LocalDate.parse(createdBefore.get()), pageable);
        }
        if (createdAfter.isPresent()) {
            return shopRepository.findByCreatedAtGreaterThan(
                    LocalDate.parse(createdAfter.get()), pageable);
        }

        return null;
    }
}
