export class HeaderDataRef {
title: string;
canGoBack: boolean;

constructor(options: {title: string , canGoBack: boolean}) {
    this.title = options.title;
    this.canGoBack = options.canGoBack || false;
}
}
