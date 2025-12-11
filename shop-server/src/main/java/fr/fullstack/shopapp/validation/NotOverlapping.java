package fr.fullstack.shopapp.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = OpeningHoursShopValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface NotOverlapping {

    String message() default "Opening hours of a shop must not overlap";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
