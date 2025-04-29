package com.nusiss.util;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ChangeTrackerUtil {
    public static <T> boolean hasChanged(T oldVal, T newVal) {
        return !oldVal.equals(newVal);
    }

    public static boolean hasChanged(BigDecimal oldVal, BigDecimal newVal) {
        return oldVal.compareTo(newVal) != 0;
    }

    public static boolean hasChanged(List<String> newList, List<String> oldList) {
        if (oldList.size() != newList.size()) return true;
        for (int i = 0; i < oldList.size(); i++) {
            if (!Objects.equals(oldList.get(i).trim(), newList.get(i).trim())) {
                return true;
            }
        }
        return false;
    }
}
