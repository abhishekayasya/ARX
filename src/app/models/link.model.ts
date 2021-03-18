export interface LinkModel {
  openInNewWindow: boolean;
  title: string;
  externalUrl: string;
  pageUrl: string;
  description: string;
  showModel: boolean;
  model?: {
    title: string;
    description: string;
    buttonText: string;
    linkText: string;
  };
}
