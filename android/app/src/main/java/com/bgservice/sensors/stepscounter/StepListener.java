package com.bgservice.sensors.stepscounter;

// Will listen to step alerts
public interface StepListener {
 
  public void step(long timeNs);
 
}