export class NavigationService {
  currentState = 'start';

  states = {
    'start': {
      'show': true
    },
    'stepSiteAdd': {
      'show': false
    },
    'stepSiteEdit': {
      'show': false
    },
    'stepSiteDelete': {
      'show': false
    },
    'stepFormAdd': {
      'show': false
    },
    'stepFormEdit': {
      'show': false
    },
    'stepFormDelete': {
      'show': false
    },
    'stepFormView': {
      'show': false
    },
    'stepTemplateEditor': {
      'show': false
    },
    'stepTemplateRegen': {
      'show': false
    }
  };

  constructor() {
  }

  setState(currentState: string) {
    for (var key in this.states) {
      if (key === currentState) {
        this.states[key].show = true;
      }
      else {
        this.states[key].show = false;
      }
    }
  }
}
