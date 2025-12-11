package fr.fullstack.shopapp.service;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.massindexing.MassIndexer;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import fr.fullstack.shopapp.model.Shop;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
public class ElasticSearchService {

        @PersistenceContext
        private EntityManager entityManager;

        @Transactional
        public void reindexAll() throws InterruptedException {
                Session session = entityManager.unwrap(Session.class);
                SearchSession searchSession = Search.session(session);

                MassIndexer indexer = searchSession.massIndexer(Shop.class)
                                .threadsToLoadObjects(5)
                                .batchSizeToLoadObjects(25)
                                .idFetchSize(150);

                indexer.startAndWait();
        }

        public Page<Shop> searchShops(String searchQuery, Pageable pageable) {
                Session session = entityManager.unwrap(Session.class);
                SearchSession searchSession = Search.session(session);

                String sanitizedSearchQuery = searchQuery.trim();

                List<Shop> results = searchSession.search(Shop.class)
                                .where(f -> f.bool()
                                                .must(f.match()
                                                                .field("name")
                                                                .matching(sanitizedSearchQuery)
                                                                .fuzzy(2)))
                                .fetch((int) pageable.getOffset(), pageable.getPageSize())
                                .hits();

                return new PageImpl<>(results, pageable, results.size());
        }
}