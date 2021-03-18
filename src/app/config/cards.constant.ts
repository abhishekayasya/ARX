export const CARD_TYPES = [
    {
      name: 'amex',
      range: '34,37',
      valid_length: [15],
      icon : '/modules/alliancerx-www-components/javascript/angular/refillHub/assets/images/Amex_card.png',
      validator_key: 'amex',
      type: 'AMEX'
    },
    {
      name: 'visa',
      range: '4',
      valid_length: [13, 14, 15, 16, 17, 18, 19],
      icon: '/modules/alliancerx-www-components/javascript/angular/refillHub/assets/images/VISA_card.png',
      validator_key: 'visa',
      type: 'VISA'
    }, {
      name: 'mastercard',
      range: '51-55,2221-2720',
      valid_length: [16],
      icon: '/modules/alliancerx-www-components/javascript/angular/refillHub/assets/images/Mastercard.png',
      validator_key: 'mastercard',
      type: 'MC'
    }, {
      name: 'mastercard',
      range: '51-55,2221-2720',
      valid_length: [16],
      icon: '/modules/alliancerx-www-components/javascript/angular/refillHub/assets/images/Mastercard.png',
      validator_key: 'mastercard',
      type: 'MasterCard'
    }, {
      name: 'discover',
      range: '6011, 622126-622925, 644-649, 65',
      valid_length: [16],
      icon: '/modules/alliancerx-www-components/javascript/angular/refillHub/assets/images/Discover_card.png',
      validator_key: 'discover',
      type: 'DISC'
    },
    {
      name: 'discover',
      range: '6011, 622126-622925, 644-649, 65',
      valid_length: [16],
      icon: '/modules/alliancerx-www-components/javascript/angular/refillHub/assets/images/Discover_card.png',
      validator_key: 'discover',
      type: 'Discover'
    }
  ];
