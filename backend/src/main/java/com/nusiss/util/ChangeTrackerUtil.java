package com.nusiss.util;

public class ChangeTrackerUtil {
    public static <T> boolean hasChanged(T oldVal, T newVal) {
//        return (oldVal == null && newVal != null) ||
//                (oldVal != null && !oldVal.equals(newVal));
        return (oldVal != null && !oldVal.equals(newVal));
    }
}
