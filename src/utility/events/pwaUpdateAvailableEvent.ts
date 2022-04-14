export default class PWAUpdateAvailableEvent extends CustomEvent<unknown> {
  constructor() {
    super('pwaupdateavailable', {});
  }
}
