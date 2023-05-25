export class Dialog {
  private resolve: ((value: boolean) => void) | null = null;
  // В идеале сделать через uuid4. Данное решение используется, 
  // чтобы не подключать сторонние библиотеки.
  // При данном подходе может быть ситуация, в которой в одно и то же время откроется несколько диалогов.
  // В таком случае при закрытии одного, закроются все (с одинаковым id)
  public id = Date.now() 

  protected open(): Promise<boolean> {
    const event = new CustomEvent('open-event', {detail: this})
    return new Promise((resolve) => {
      this.resolve = resolve;
      document.dispatchEvent(event);
    });
  }

  public close(value: boolean) {
    const closeEvent = new CustomEvent('close-event', {detail: this})
    if (this.resolve) {
      this.resolve(value)
      document.dispatchEvent(closeEvent);
    }
  }
}
