var crc = require('crc');

function BeanMessage() {

  var count = 0;

  this.requestTemp = function() {
    var cmdBuffer     = new Buffer([0x20, 0x11]);
    var payloadBuffer = new Buffer([]);

    return buildMessage(cmdBuffer, payloadBuffer);
  };

  this.requestLED = function() {
    var cmdBuffer     = new Buffer([0x20, 0x02]);
    var payloadBuffer = new Buffer([]);

    return buildMessage(cmdBuffer, payloadBuffer);
  };

  this.requestAccel = function() {
    var cmdBuffer     = new Buffer([0x20, 0x10]);
    var payloadBuffer = new Buffer([]);

    return buildMessage(cmdBuffer, payloadBuffer);
  };

  this.setLED = function(red, green, blue) {
    var cmdBuffer     = new Buffer([0x20, 0x01]);
    var payloadBuffer = new Buffer([red, green, blue]);

    return buildMessage(cmdBuffer, payloadBuffer);
  };

  function buildMessage(cmd, payload) {
    var appMessage    = Buffer.concat([cmd, payload]);
    var sizeBuffer    = buildSizeBuffer(appMessage);
    var gstBuffer     = Buffer.concat([sizeBuffer, appMessage]);
    var crcBuffer     = buildCrcBuffer(gstBuffer);

    return buildGattBuffer(gstBuffer, crcBuffer);
  }

  function buildSizeBuffer(message) {
    var buffer = new Buffer(2);
    buffer.writeUInt8(message.length, 0);
    buffer.writeUInt8(0, 1); // reserved byte
    return buffer;
  }

  function buildGattBuffer(gst, crc) {
    var gattBuffer = new Buffer(1 + gst.length + crc.length);
    gattBuffer[0] = header();
    gst.copy(gattBuffer, 1, 0);

    // Swap the crc bytes and append to gatt
    gattBuffer[gattBuffer.length - 2] = crc[1];
    gattBuffer[gattBuffer.length - 1] = crc[0];

    return gattBuffer;
  }

  function buildCrcBuffer(gst) {
    var crcValue  = crc.crc16ccitt(gst);
    var crcBuffer = new Buffer(2);
    crcBuffer.writeUInt16LE(crcValue, 0);

    return crcBuffer;
  }

  /*
   * TODO: I still think I'm building this header byte wrong, but it works most
   * of the time.
   */
  function header() {
    return ((count++ * 0x20) | 0x80) & 0xff;
  }

}

module.exports = BeanMessage;
