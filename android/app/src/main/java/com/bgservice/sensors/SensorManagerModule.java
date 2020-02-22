package com.bgservice.sensors;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.util.Log;

import com.bgservice.sensors.stepscounter.StepCounter;

public class SensorManagerModule extends ReactContextBaseJavaModule {
  private static final String		REACT_CLASS = "SensorManager";
  private StepCounterRecord		mStepCounterRecord = null;
  private LightSensorRecord   mLightSensorRecord = null;
  private StepCounter mStepCounter = null;

	private ReactApplicationContext	mReactContext;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public SensorManagerModule(ReactApplicationContext reactContext) {
		super(reactContext);
		mReactContext = reactContext;
    }

    @ReactMethod
    public int startStepCounter(int delay) {
		if (mStepCounterRecord == null)
			mStepCounterRecord = new StepCounterRecord(mReactContext);
		  return (mStepCounterRecord.start(delay));
    }

    @ReactMethod
    public void stopStepCounter() {
		if (mStepCounterRecord != null)
			mStepCounterRecord.stop();
    }

    @ReactMethod
    public int startStepCounterUsingAccel(int delay) {
		if (mStepCounter == null)
			mStepCounter = new StepCounter(mReactContext);
		  return (mStepCounter.start(delay));
    }

    @ReactMethod
    public void stopStepCounterUsingAccel() {
		if (mStepCounter != null)
			mStepCounter.stop();
    }

    @ReactMethod
    public int startLightSensor(int delay) {
      if(mLightSensorRecord == null)
        mLightSensorRecord = new LightSensorRecord(mReactContext);
      return (mLightSensorRecord.start(delay));
    }

    @ReactMethod
    public void stopLightSensor() {
      if(mLightSensorRecord != null)
        mLightSensorRecord.stop();
    }

	/*
    @Override
    public ReactBarcodeScannerView createViewInstance(ThemedReactContext context) {
    }

    @Override
    public void onDropViewInstance(ReactBarcodeScannerView view) {
    }

    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
    }
    */
}
