package fr.fullstack.shopapp.validation;

import java.util.List;

import fr.fullstack.shopapp.model.OpeningHoursShop;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class OpeningHoursShopValidator implements ConstraintValidator<NotOverlapping, List<OpeningHoursShop>> {

    @Override
    public boolean isValid(List<OpeningHoursShop> value, ConstraintValidatorContext context) {
        if (value.isEmpty()) {
            return true;
        }
        List<OpeningHoursShop> openingHours = value;

        for (int i = 0; i < openingHours.size(); i++) {
            for (int j = i + 1; j < openingHours.size(); j++) {
                if (isOverlapping(openingHours.get(i), openingHours.get(j))) {
                    return false;
                }
            }
        }
        return true;
    }

    // TOOLS

    private boolean isOverlapping(OpeningHoursShop i, OpeningHoursShop j) {
        return (i.getDay() == j.getDay())
                && !(i.getCloseAt().isBefore(j.getOpenAt()) || i.getOpenAt().isAfter(j.getCloseAt()));
    }

}
