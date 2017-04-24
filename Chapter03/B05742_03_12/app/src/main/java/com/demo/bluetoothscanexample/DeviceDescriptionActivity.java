package com.demo.bluetoothscanexample;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.util.List;
import java.util.UUID;

public class DeviceDescriptionActivity extends AppCompatActivity {

    private BluetoothGatt mBluetoothGatt;
    private static final int STATE_DISCONNECTED = 0;
    private static final int STATE_CONNECTING = 1;
    private static final int STATE_CONNECTED = 2;

    private TextView descriptionMac;
    private TextView descriptionServices;
    private TextView descriptionCharacteristic;
    private Button buttonReadCharacteristic;

    private UUID heartRateServiceUUID = UUID.fromString("0000180d-0000-1000-8000-00805f9b34fb");

    public final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            super.onConnectionStateChange(gatt, status, newState);
            switch (newState) {
                case STATE_CONNECTED:
                    Log.i("gattCallback", "STATE_CONNECTED");
                    gatt.discoverServices();
                    break;
                case STATE_DISCONNECTED:
                    Log.e("gattCallback", "STATE_DISCONNECTED");
                    break;
                case STATE_CONNECTING:
                    Log.i("gattCallback", "STATE_CONNECTING");
                    break;
                default:
                    Log.e("gattCallback", "STATE_OTHER");
            }
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            super.onServicesDiscovered(gatt, status);

            final List<BluetoothGattService> services = gatt.getServices();

            for (int i = 0; i < services.size(); i++) {
                final int localIndex = i;
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        descriptionServices.append(services.get(localIndex).getUuid().toString() + "\n");
                    }
                });
            }
            buttonReadCharacteristic.setVisibility(View.VISIBLE);
        }

        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            super.onCharacteristicRead(gatt, characteristic, status);
            Log.i("gattCallback", "CHARACTERISTIC_READ");

        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
            super.onCharacteristicChanged(gatt, characteristic);
        }

        @Override
        public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            super.onCharacteristicWrite(gatt, characteristic, status);
        }
    };

    @Override
    protected void onPause() {
        super.onPause();
        mBluetoothGatt.disconnect();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_device_description);

        BluetoothDevice device = getIntent().getExtras().getParcelable("Bluetooth_Device");

        descriptionMac = (TextView) findViewById(R.id.device_description_mac);
        descriptionServices = (TextView) findViewById(R.id.device_description_services);
        descriptionCharacteristic = (TextView) findViewById(R.id.device_description_characteristics);
        buttonReadCharacteristic = (Button) findViewById(R.id.readCharacteristicsButton);
        buttonReadCharacteristic.setVisibility(View.INVISIBLE);

        descriptionMac.setText(device.getAddress());
        descriptionServices.setText("");
        descriptionCharacteristic.setText("");

        connect(device);
    }


    public void connect(BluetoothDevice device) {
        if (mBluetoothGatt == null) {
            mBluetoothGatt = device.connectGatt(DeviceDescriptionActivity.this, false, mGattCallback);
        }
    }

    public void onClickReadCharacteristic(View button) {
        final List<BluetoothGattCharacteristic> characteristics = mBluetoothGatt.getService(heartRateServiceUUID).getCharacteristics();
        descriptionServices.append("Reading Characteristics: \n");
        for (int i = 0; i < characteristics.size(); i++) {
            final int localIndex = i;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    descriptionServices.append(characteristics.get(localIndex).getUuid().toString() + "\n");
                }
            });
        }
    }
}
