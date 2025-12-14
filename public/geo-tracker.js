/**
 * GeoTracker - Modulo di tracciamento geolocalizzazione
 * File: geo-tracker.js
 */

window.GeoTracker = {
  _endpoint: null,
  _intervalId: null,
  _config: { interval: 10000 },

  init(config) {
    if (!config || !config.endpoint) {
      console.error('GeoTracker: endpoint mancante');
      return;
    }
    this._endpoint = config.endpoint;
    this._config.interval = config.interval || 10000;
    this._createDeviceId();
  },

  start() {
    if (!this._endpoint) {
      console.error('GeoTracker: non inizializzato. Chiama .init() prima di .start()');
      return;
    }
    this.stop();
    this._ping();
    this._intervalId = setInterval(() => this._ping(), this._config.interval);
  },

  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  },

  setEndpoint(url) {
    this._endpoint = url;
  },

  _createDeviceId() {
    const storageKey = 'geo-tracker-device-id';
    if (!localStorage.getItem(storageKey)) {
      const deviceId = 'device-' + Date.now() + '-' + Math.random().toString(16).slice(2);
      localStorage.setItem(storageKey, deviceId);
    }
  },

  _ping() {
    if (!navigator.geolocation) {
      console.warn('GeoTracker: Geolocation API non disponibile');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => this._onLocationSuccess(pos),
      (err) => this._onLocationError(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  },

  _onLocationSuccess(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const ts = new Date().toISOString();
    const deviceId = localStorage.getItem('geo-tracker-device-id');

    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      ts: ts,
      deviceId: deviceId
    });

    fetch(this._endpoint + '?' + params.toString())
      .catch(err => {
        console.debug('GeoTracker: fetch error (silenzioso)', err);
      });
  },

  _onLocationError(err) {
    console.debug('GeoTracker: geolocation error (silenzioso)', err.code, err.message);
  }
};
