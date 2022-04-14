export default class PWAUpdateConfirmEvent extends CustomEvent<unknown> {
  constructor() {
    super('pwaupdateconfirm', {});
  }
}
