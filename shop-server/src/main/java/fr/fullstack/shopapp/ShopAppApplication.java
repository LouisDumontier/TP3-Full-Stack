package fr.fullstack.shopapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShopAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopAppApplication.class, args);
    }

    // @Bean
    // public Docket api() {
    // return new Docket(DocumentationType.SWAGGER_2)
    // .ignoredParameterTypes(Errors.class, Pageable.class)
    // .select()
    // .apis(RequestHandlerSelectors.basePackage("fr.fullstack.shopapp.controller"))
    // .paths(PathSelectors.any())
    // .build();
    // }

}
