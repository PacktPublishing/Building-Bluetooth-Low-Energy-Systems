package com.demo.bluetoothscanexample;

import android.Manifest;
import android.app.ListActivity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Toast;

import com.demo.bluetoothscanexample.adapter.BluetoothLeListAdapter;

import java.util.List;

public class MainActivity extends ListActivity {

    private static  int REQUEST_CODE_COARSE_PERMISSION = 1;
    private static int REQUEST_CODE_BLUETOOTH_PERMISSION = 2;

    private static long SCAN_PERIOD = 10000;

    private BluetoothManager mBluetoothManager;
    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothLeScanner mBluetoothLeScanner;
    private BluetoothLeListAdapter mLeDeviceListAdapter;

    private Handler mHandler;
    private boolean mScanning;

    private ScanCallback mBluetoothScanCallBack = new ScanCallback() {
        @Override
        public void onScanResult(int callbackType, final ScanResult result) {
            super.onScanResult(callbackType, result);
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mLeDeviceListAdapter.addDevice(result.getDevice());
                    mLeDeviceListAdapter.notifyDataSetChanged();
                }
            });
        }

        @Override
        public void onScanFailed(int errorCode) {
            super.onScanFailed(errorCode);
            Toast.makeText(MainActivity.this, "Scan Failed: Please try again...", Toast.LENGTH_LONG).show();
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mHandler = new Handler();

        mBluetoothManager =
                (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = mBluetoothManager.getAdapter();
        mLeDeviceListAdapter = new BluetoothLeListAdapter(this);
        
        // Add this line to make scanning work!!!
        mBluetoothLeScanner = mBluetoothAdapter.getBluetoothLeScanner();


        //Check if Bluetooth Low Energy is supported by the device
        if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            Toast.makeText(this, R.string.ble_not_supported, Toast.LENGTH_SHORT).show();
            finish();
        }
        askCoarsePermission();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if(requestCode == REQUEST_CODE_BLUETOOTH_PERMISSION){
            askCoarsePermission();
        }
        mBluetoothLeScanner = mBluetoothAdapter.getBluetoothLeScanner();
        scanBluetoothDevices(true);
    }

    @Override
    protected void onResume() {
        super.onResume();
        setListAdapter(mLeDeviceListAdapter);
        askBluetoothPermission();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mLeDeviceListAdapter.clear();
    }

    private void askCoarsePermission() {
        if (this.checkSelfPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{android.Manifest.permission.ACCESS_COARSE_LOCATION}, REQUEST_CODE_COARSE_PERMISSION);
        }
    }

    private void askBluetoothPermission() {
        if (!mBluetoothAdapter.isEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(enableBtIntent, REQUEST_CODE_BLUETOOTH_PERMISSION);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if(requestCode == REQUEST_CODE_COARSE_PERMISSION){
            Toast.makeText(this, "Coarse Permission Granted...", Toast.LENGTH_LONG).show();
            askBluetoothPermission();
        }
    }

    private void scanBluetoothDevices(boolean enable) {

        if (enable) {
            // Stops scanning after a pre-defined scan period.
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    mScanning = false;
                    mBluetoothLeScanner.stopScan(mBluetoothScanCallBack);
                }
            }, SCAN_PERIOD);
            mScanning = true;
            mBluetoothLeScanner.startScan(mBluetoothScanCallBack);
        } else {
            mScanning = false;
            mBluetoothLeScanner.stopScan(mBluetoothScanCallBack);
        }
    }
}
