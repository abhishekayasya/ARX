import {CartModel} from '@app/models/cart.model';
import {ProfileIndModel} from '@app/models/profile-ind.model';
import {NotificationInfoModel} from '@app/models/notification-info.model';
import {ProfileInfoModel} from '@app/models/profile-info.model';

export interface HeaderModel {

  cartInfo: CartModel;

  profileInd: ProfileIndModel;

  notificationInfo: NotificationInfoModel;

  profileInfo: ProfileInfoModel;

}
