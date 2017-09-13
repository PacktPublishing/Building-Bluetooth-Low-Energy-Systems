function SensorData(buffer) {
  "use strict";

  var BIT_ACCELEROMETER = 1,
    BIT_GYROSCOPE = 2,
    BIT_HUMIDITY = 4,
    BIT_MAGNETOMETER = 8,
    BIT_PRESSURE = 16,
    BIT_TEMPERATURE = 32;

  this.data = parseData();

  function parseData() {
    var bitMask = buffer[0],
        pos = 1,
        data = {};

    if (bitMask & BIT_ACCELEROMETER) {
      data.accelerometer = {};

      data.accelerometer.x = buffer.readInt16LE(pos);
      pos += 2;
      data.accelerometer.y = buffer.readInt16LE(pos);
      pos += 2;
      data.accelerometer.z = buffer.readInt16LE(pos);
      pos += 2;
    }

    if (bitMask & BIT_GYROSCOPE) {
      data.gyroscope = {};

      data.gyroscope.x = buffer.readInt16LE(pos);
      pos += 2;
      data.gyroscope.y = buffer.readInt16LE(pos);
      pos += 2;
      data.gyroscope.z = buffer.readInt16LE(pos);
      pos += 2;
    }

    if (bitMask & BIT_HUMIDITY) {
      data.humidity = buffer.readInt16LE(pos) / 10;
      pos += 2;
    }

    if (bitMask & BIT_MAGNETOMETER) {
      data.magnetometer = {};

      data.magnetometer.x = buffer.readInt16LE(pos);
      pos +=2;
      data.magnetometer.y = buffer.readInt16LE(pos);
      pos +=2;
      data.magnetometer.z = buffer.readInt16LE(pos);
      pos += 2;
    }

    if (bitMask & BIT_PRESSURE) {
      data.pressure = buffer.readInt16LE(pos) / 10;
      pos += 2;
    }

    if (bitMask & BIT_TEMPERATURE) {
      // Show this in Farenheight
      data.temp = buffer.readInt16LE(pos) * 1.8 / 10 + 32 ;
      pos += 2;
    }

    return data;
  }
}

module.exports = SensorData;
