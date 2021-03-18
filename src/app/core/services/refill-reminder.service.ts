import { Injectable } from '@angular/core';
import { KEYS } from '@app/config';
import { SPRefillReminderStateModel } from '@app/models/sp-refillreminder.model';

/**
 * Service to handle refill reminder actions.
 */
@Injectable()
export class RefillReminderService {

  constructor() {}

  /**
   * Check if specialty refill reminder state is present or not.
   */
  public isSpecialtyAvailable(): boolean {
    if ( localStorage.getItem( KEYS.sp_rr_state_flag ) ) {
      let state: SPRefillReminderStateModel = JSON.parse( localStorage.getItem( KEYS.sp_rr_state_flag ) );
      return !state.dcaState;
    }
    return false;
  }

  /**
   * Get parameters for Specialty refill reminder from localstore state.
   */
  public getSpecialtyParameters(): any {
    if ( localStorage.getItem( KEYS.sp_rr_state_flag ) ) {
      let state: SPRefillReminderStateModel = JSON.parse( localStorage.getItem( KEYS.sp_rr_state_flag ) );
      return state.params;
    }
  }

  /**
   * Update DCA state for Specialty refill reminder.
   *
   * @param newState New DCA state.
   */
  public updateDCAState(newState: boolean) {
    if ( localStorage.getItem( KEYS.sp_rr_state_flag ) ) {
      let state: SPRefillReminderStateModel = JSON.parse( localStorage.getItem( KEYS.sp_rr_state_flag ) );
      state.dcaState = newState;
      localStorage.setItem( KEYS.sp_rr_state_flag, JSON.stringify(state) );
    }
  }

  /**
   * Clear Specialty refill reminder state.
   */
  public removeSPReminderState(): void {
    localStorage.removeItem( KEYS.sp_rr_state_flag );
  }

}
