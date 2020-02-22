package com.bgservice;

import com.facebook.react.ReactActivity;

import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;

import com.bgservice.UsageStatsModule;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "BGService";
  }
  @Override
      protected void onCreate(Bundle savedInstanceState) {
          super.onCreate(savedInstanceState);

          //Check if permission enabled
          if (UsageStatsModule.getUsageStatsList(this).isEmpty()){
              Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
              startActivity(intent);
          }
      }
}
