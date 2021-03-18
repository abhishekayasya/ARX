import { HtmlPipe } from "./html.pipe";
import { CcnumberPipe } from "./ccnumber.pipe";
import { PricePipe } from "@app/shared/pipes/price.pipe";
import { OrderByPipe } from "@app/shared/pipes/orderby.pipe";

export const Pipes = [HtmlPipe, CcnumberPipe, PricePipe, OrderByPipe];
