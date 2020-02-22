package com.bgservice;

import com.facebook.react.HeadlessJsTaskService;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

public class BootUpReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        Intent service = new Intent(context, BroadcastService.class);
        Bundle bundle = new Bundle();


        if(intent.getAction().equals(Intent.ACTION_USER_PRESENT)) {
            bundle.putString("Event", "ACTION_USER_PRESENT");
            service.putExtras(bundle); 
            context.startService(service);
        }

        // if(intent.getAction().equals(Intent.ACTION_SCREEN_ON)) {
        //     bundle.putString("Event", "ACTION_SCREEN_ON");
        //     service.putExtras(bundle); 
        //     context.startService(service);
        // }

        if(intent.getAction().equals(Intent.ACTION_SCREEN_OFF)) {
            bundle.putString("Event", "ACTION_SCREEN_OFF");
            service.putExtras(bundle); 
            context.startService(service);
        }

        if(intent.getAction().equals(Intent.ACTION_HEADSET_PLUG)) {
            bundle.putString("Event", "ACTION_HEADSET_PLUG");
            service.putExtras(bundle); 
            context.startService(service);
        }
        
        // if(intent.getAction().equals(Intent.ACTION_CAMERA_BUTTON)) {
        //     bundle.putString("Event", "ACTION_CAMERA_BUTTON");
        //     service.putExtras(bundle); 
        //     context.startService(service);
        // }

        if(intent.getAction().equals(Intent.ACTION_BOOT_COMPLETED)) {
            context.startService(new Intent(context, HeartbeartService.class)); 
        }
        HeadlessJsTaskService.acquireWakeLockNow(context);
    }
}