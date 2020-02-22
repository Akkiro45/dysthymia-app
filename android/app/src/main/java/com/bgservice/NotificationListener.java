package com.bgservice;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

public class NotificationListener extends NotificationListenerService {
    Context context = getApplicationContext();
    Intent service = new Intent(context, BroadcastService.class);
    Bundle bundle = new Bundle();
  
    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        super.onNotificationPosted(sbn);
        bundle.putString("Event", "NOTIFICATION_POSTED");
        service.putExtras(bundle); 
        context.startService(service);
    }
    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        super.onNotificationRemoved(sbn);
        bundle.putString("Event", "NOTIFICATION_REMOVED");
        service.putExtras(bundle);
        context.startService(service);
    }
}