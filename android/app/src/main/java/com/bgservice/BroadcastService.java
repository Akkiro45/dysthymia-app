package com.bgservice;

import android.content.Intent;
import android.os.Bundle;
// import android.support.annotation.Nullable;
import javax.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.bridge.WritableMap;

public class BroadcastService extends HeadlessJsTaskService {
    @Nullable
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        WritableMap data = extras != null ? Arguments.fromBundle(extras) : Arguments.createMap();
        return new HeadlessJsTaskConfig(
                "BroadcastService",
                data,
                5000,
                true);
    }
}