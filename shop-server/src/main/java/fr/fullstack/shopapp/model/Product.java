package fr.fullstack.shopapp.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;

@Entity
@Table(name = "products")
@Indexed(index = "shop_id")
public class Product {
    @ManyToMany
    @JoinTable(name = "products_categories", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "category_id"), indexes = {
            @Index(columnList = "product_id"),
            @Index(columnList = "category_id")
    })
    private List<Category> categories = new ArrayList<Category>();

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @OneToMany(cascade = {
            CascadeType.ALL }, orphanRemoval = true)
    @Size(min = 1, message = "At least one name and one description must be provided")
    @JoinColumn(name = "product_id")
    private List<@Valid LocalizedProduct> localizedProduct = new ArrayList<LocalizedProduct>();

    @Column(nullable = false)
    @PositiveOrZero(message = "Price must be positive")
    @NotNull(message = "Price may not be null")
    private long price;

    @ManyToOne
    private Shop shop;

    public List<Category> getCategories() {
        return categories;
    }

    public long getId() {
        return id;
    }

    public List<LocalizedProduct> getLocalizedProducts() {
        return localizedProduct;
    }

    public float getPrice() {
        return price;
    }

    public Shop getShop() {
        return shop;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setLocalizedProducts(List<LocalizedProduct> localizedProduct) {
        this.localizedProduct = localizedProduct;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }
}
