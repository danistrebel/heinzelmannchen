interface ColorScope extends ng.IScope {
  color: string;
  toggleColor(): void;
  supportsColorInput: boolean;
  onColorChange(): void;
}


class ColorPicker implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'views/colorpicker.html';
    replace = true;
    scope = {
      color: '=',
      onColorChange: '='
    };

    link = (scope: ColorScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

      var allColors = ['#64dd17', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477'];

      var input = document.createElement('input');

      input.setAttribute('type', 'color');

      scope.supportsColorInput = input.type==='color';

      scope.toggleColor = function() {
        if(scope.supportsColorInput) {
          return; //let the color picker do the rest.
        }

        var currentColorIndex = allColors.indexOf(scope.color);

        var nextColorIndex = ((currentColorIndex >= 0 ? currentColorIndex : 0) + 1) % allColors.length;
        scope.color = allColors[nextColorIndex];
        scope.onColorChange();
      }
    }
}

angular.module('heinzelmannchen').directive('colorPicker', () => new ColorPicker());
