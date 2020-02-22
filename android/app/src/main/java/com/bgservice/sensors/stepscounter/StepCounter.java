package com.bgservice.sensors.stepscounter;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.Log;
import androidx.annotation.Nullable;

import java.io.*;
import java.util.Date;
import java.util.Timer;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactApplicationContext;

public class StepCounter implements SensorEventListener, StepListener {
  private StepDetector simpleStepDetector;
  private SensorManager sensorManager;
  private Sensor accel;
  private int numSteps;
  private long lastUpdate = 0;
  private int i = 0;
	private int delay;

  private ReactContext mReactContext;
  private Arguments mArguments;

  public StepCounter(ReactApplicationContext reactContext) {
    sensorManager = (SensorManager)reactContext.getSystemService(reactContext.SENSOR_SERVICE);
    mReactContext = reactContext;
  }
  public int start(int delay) {
		this.delay = delay;
    if ((accel = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)) != null) {
      numSteps = 0;
      simpleStepDetector = new StepDetector();
      simpleStepDetector.registerListener(this);
      sensorManager.registerListener(this, accel, SensorManager.SENSOR_DELAY_FASTEST);
			return (1);
		}
		return (0);
  }
  public void stop() {
    sensorManager.unregisterListener(this);
  }

  private void sendEvent(String eventName, @Nullable WritableMap params)
	{
		try {
			mReactContext 
				.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class) 
				.emit(eventName, params);
		} catch (RuntimeException e) {
			Log.e("ERROR", "java.lang.RuntimeException: Trying to invoke JS before CatalystInstance has been set!");
		}
	}
  
  @Override
  public void onAccuracyChanged(Sensor sensor, int accuracy) {
  }
 
  @Override
  public void onSensorChanged(SensorEvent event) {
    if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
      simpleStepDetector.updateAccel(
          event.timestamp, event.values[0], event.values[1], event.values[2]);
    }
  }
  
  @Override
  public void step(long timeNs) {
    numSteps++;
    // TvSteps.setText(TEXT_NUM_STEPS + numSteps);
    WritableMap map = mArguments.createMap();
    long curTime = System.currentTimeMillis();
    i++;
    if ((curTime - lastUpdate) > delay) {
      i = 0;
      map.putDouble("steps", numSteps);
      sendEvent("StepCounterUsingAccel", map);
      lastUpdate = curTime;
    }
  }
}