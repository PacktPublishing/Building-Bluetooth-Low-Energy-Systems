function BeanData(buffer) {
  var PERIPHERAL_MSG   = 0x20,
      ACCEL_RESP_MSG   = 0x90,
      TEMP_RESP_MSG    = 0x91,
      LED_ALL_RESP_MSG = 0x82;

  this.data = parseData();

  function parseData() {
    var gst = buffer.slice(1); // Throwing away the GT header for now, because only expecting single packet messages

    if ((PERIPHERAL_MSG === gst[2]) && (TEMP_RESP_MSG === gst[3])) {
      return parseTemp(gst);
    }

    if ((PERIPHERAL_MSG === gst[2]) && (LED_ALL_RESP_MSG === gst[3])) {
      return parseLed(gst);
    }

    if ((PERIPHERAL_MSG === gst[2]) && (ACCEL_RESP_MSG === gst[3])) {
      return parseAccel(gst);
    }

    return gst;
  }

  function parseTemp(gst) {
    var degreesC = gst.readInt8(4);
    var degreesF = (degreesC * 1.8) + 32;

    return { temp: { C: degreesC, F: degreesF } };
  }

  function parseLed(gst) {
    var r = gst.readInt8(4);
    var g = gst.readInt8(5);
    var b = gst.readInt8(6);

    return { r: r, g: g, b: b };
  }

  function parseAccel(gst) {
    var sensitivity = gst.readInt8(10);
    var x = gst.readInt16LE(4) * (sensitivity / 511);
    var y = gst.readInt16LE(6) * (sensitivity / 511);
    var z = gst.readInt16LE(8) * (sensitivity / 511);

    return { x: x.toFixed(5), y: y.toFixed(5), z: z.toFixed(5) };
  }

}

module.exports = BeanData;
