 /*
 * # Semantic UI - 1.8.1
 * https://github.com/Semantic-Org/Semantic-UI
 * http://www.semantic-ui.com/
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
/*
 * # Semantic - Site
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributor
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
;(function ( $, window, document, undefined ) {

$.site = $.fn.site = function(parameters) {
  var
    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),

    settings        = ( $.isPlainObject(parameters) )
      ? $.extend(true, {}, $.site.settings, parameters)
      : $.extend({}, $.site.settings),

    namespace       = settings.namespace,
    error           = settings.error,

    eventNamespace  = '.' + namespace,
    moduleNamespace = 'module-' + namespace,

    $document       = $(document),
    $module         = $document,
    element         = this,
    instance        = $module.data(moduleNamespace),

    module,
    returnedValue
  ;
  module = {

    initialize: function() {
      module.instantiate();
    },

    instantiate: function() {
      module.verbose('Storing instance of site', module);
      instance = module;
      $module
        .data(moduleNamespace, module)
      ;
    },

    normalize: function() {
      module.fix.console();
      module.fix.requestAnimationFrame();
    },

    fix: {
      console: function() {
        module.debug('Normalizing window.console');
        if (console === undefined || console.log === undefined) {
          module.verbose('Console not available, normalizing events');
          module.disable.console();
        }
        if (typeof console.group == 'undefined' || typeof console.groupEnd == 'undefined' || typeof console.groupCollapsed == 'undefined') {
          module.verbose('Console group not available, normalizing events');
          window.console.group = function() {};
          window.console.groupEnd = function() {};
          window.console.groupCollapsed = function() {};
        }
        if (typeof console.markTimeline == 'undefined') {
          module.verbose('Mark timeline not available, normalizing events');
          window.console.markTimeline = function() {};
        }
      },
      consoleClear: function() {
        module.debug('Disabling programmatic console clearing');
        window.console.clear = function() {};
      },
      requestAnimationFrame: function() {
        module.debug('Normalizing requestAnimationFrame');
        if(window.requestAnimationFrame === undefined) {
          module.debug('RequestAnimationFrame not available, normailizing event');
          window.requestAnimationFrame = window.requestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(callback) { setTimeout(callback, 0); }
          ;
        }
      }
    },

    moduleExists: function(name) {
      return ($.fn[name] !== undefined && $.fn[name].settings !== undefined);
    },

    enabled: {
      modules: function(modules) {
        var
          enabledModules = []
        ;
        modules = modules || settings.modules;
        $.each(modules, function(index, name) {
          if(module.moduleExists(name)) {
            enabledModules.push(name);
          }
        });
        return enabledModules;
      }
    },

    disabled: {
      modules: function(modules) {
        var
          disabledModules = []
        ;
        modules = modules || settings.modules;
        $.each(modules, function(index, name) {
          if(!module.moduleExists(name)) {
            disabledModules.push(name);
          }
        });
        return disabledModules;
      }
    },

    change: {
      setting: function(setting, value, modules, modifyExisting) {
        modules = (typeof modules === 'string')
          ? (modules === 'all')
            ? settings.modules
            : [modules]
          : modules || settings.modules
        ;
        modifyExisting = (modifyExisting !== undefined)
          ? modifyExisting
          : true
        ;
        $.each(modules, function(index, name) {
          var
            namespace = (module.moduleExists(name))
              ? $.fn[name].settings.namespace || false
              : true,
            $existingModules
          ;
          if(module.moduleExists(name)) {
            module.verbose('Changing default setting', setting, value, name);
            $.fn[name].settings[setting] = value;
            if(modifyExisting && namespace) {
              $existingModules = $(':data(module-' + namespace + ')');
              if($existingModules.length > 0) {
                module.verbose('Modifying existing settings', $existingModules);
                $existingModules[name]('setting', setting, value);
              }
            }
          }
        });
      },
      settings: function(newSettings, modules, modifyExisting) {
        modules = (typeof modules === 'string')
          ? [modules]
          : modules || settings.modules
        ;
        modifyExisting = (modifyExisting !== undefined)
          ? modifyExisting
          : true
        ;
        $.each(modules, function(index, name) {
          var
            $existingModules
          ;
          if(module.moduleExists(name)) {
            module.verbose('Changing default setting', newSettings, name);
            $.extend(true, $.fn[name].settings, newSettings);
            if(modifyExisting && namespace) {
              $existingModules = $(':data(module-' + namespace + ')');
              if($existingModules.length > 0) {
                module.verbose('Modifying existing settings', $existingModules);
                $existingModules[name]('setting', newSettings);
              }
            }
          }
        });
      }
    },

    enable: {
      console: function() {
        module.console(true);
      },
      debug: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Enabling debug for modules', modules);
        module.change.setting('debug', true, modules, modifyExisting);
      },
      verbose: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Enabling verbose debug for modules', modules);
        module.change.setting('verbose', true, modules, modifyExisting);
      }
    },
    disable: {
      console: function() {
        module.console(false);
      },
      debug: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Disabling debug for modules', modules);
        module.change.setting('debug', false, modules, modifyExisting);
      },
      verbose: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Disabling verbose debug for modules', modules);
        module.change.setting('verbose', false, modules, modifyExisting);
      }
    },

    console: function(enable) {
      if(enable) {
        if(instance.cache.console === undefined) {
          module.error(error.console);
          return;
        }
        module.debug('Restoring console function');
        window.console = instance.cache.console;
      }
      else {
        module.debug('Disabling console function');
        instance.cache.console = window.console;
        window.console = {
          clear          : function(){},
          error          : function(){},
          group          : function(){},
          groupCollapsed : function(){},
          groupEnd       : function(){},
          info           : function(){},
          log            : function(){},
          markTimeline   : function(){},
          warn           : function(){}
        };
      }
    },

    destroy: function() {
      module.verbose('Destroying previous site for', $module);
      $module
        .removeData(moduleNamespace)
      ;
    },

    cache: {},

    setting: function(name, value) {
      if( $.isPlainObject(name) ) {
        $.extend(true, settings, name);
      }
      else if(value !== undefined) {
        settings[name] = value;
      }
      else {
        return settings[name];
      }
    },
    internal: function(name, value) {
      if( $.isPlainObject(name) ) {
        $.extend(true, module, name);
      }
      else if(value !== undefined) {
        module[name] = value;
      }
      else {
        return module[name];
      }
    },
    debug: function() {
      if(settings.debug) {
        if(settings.performance) {
          module.performance.log(arguments);
        }
        else {
          module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
          module.debug.apply(console, arguments);
        }
      }
    },
    verbose: function() {
      if(settings.verbose && settings.debug) {
        if(settings.performance) {
          module.performance.log(arguments);
        }
        else {
          module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
          module.verbose.apply(console, arguments);
        }
      }
    },
    error: function() {
      module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
      module.error.apply(console, arguments);
    },
    performance: {
      log: function(message) {
        var
          currentTime,
          executionTime,
          previousTime
        ;
        if(settings.performance) {
          currentTime   = new Date().getTime();
          previousTime  = time || currentTime;
          executionTime = currentTime - previousTime;
          time          = currentTime;
          performance.push({
            'Element'        : element,
            'Name'           : message[0],
            'Arguments'      : [].slice.call(message, 1) || '',
            'Execution Time' : executionTime
          });
        }
        clearTimeout(module.performance.timer);
        module.performance.timer = setTimeout(module.performance.display, 100);
      },
      display: function() {
        var
          title = settings.name + ':',
          totalTime = 0
        ;
        time = false;
        clearTimeout(module.performance.timer);
        $.each(performance, function(index, data) {
          totalTime += data['Execution Time'];
        });
        title += ' ' + totalTime + 'ms';
        if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
          console.groupCollapsed(title);
          if(console.table) {
            console.table(performance);
          }
          else {
            $.each(performance, function(index, data) {
              console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
            });
          }
          console.groupEnd();
        }
        performance = [];
      }
    },
    invoke: function(query, passedArguments, context) {
      var
        object = instance,
        maxDepth,
        found,
        response
      ;
      passedArguments = passedArguments || queryArguments;
      context         = element         || context;
      if(typeof query == 'string' && object !== undefined) {
        query    = query.split(/[\. ]/);
        maxDepth = query.length - 1;
        $.each(query, function(depth, value) {
          var camelCaseValue = (depth != maxDepth)
            ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
            : query
          ;
          if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
            object = object[camelCaseValue];
          }
          else if( object[camelCaseValue] !== undefined ) {
            found = object[camelCaseValue];
            return false;
          }
          else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
            object = object[value];
          }
          else if( object[value] !== undefined ) {
            found = object[value];
            return false;
          }
          else {
            module.error(error.method, query);
            return false;
          }
        });
      }
      if ( $.isFunction( found ) ) {
        response = found.apply(context, passedArguments);
      }
      else if(found !== undefined) {
        response = found;
      }
      if($.isArray(returnedValue)) {
        returnedValue.push(response);
      }
      else if(returnedValue !== undefined) {
        returnedValue = [returnedValue, response];
      }
      else if(response !== undefined) {
        returnedValue = response;
      }
      return found;
    }
  };

  if(methodInvoked) {
    if(instance === undefined) {
      module.initialize();
    }
    module.invoke(query);
  }
  else {
    if(instance !== undefined) {
      module.destroy();
    }
    module.initialize();
  }
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.site.settings = {

  name        : 'Site',
  namespace   : 'site',

  error : {
    console : 'Console cannot be restored, most likely it was overwritten outside of module',
    method : 'The method you called is not defined.'
  },

  debug       : false,
  verbose     : true,
  performance : true,

  modules: [
    'accordion',
    'api',
    'checkbox',
    'dimmer',
    'dropdown',
    'form',
    'modal',
    'nag',
    'popup',
    'rating',
    'shape',
    'sidebar',
    'state',
    'sticky',
    'tab',
    'transition',
    'video',
    'visit',
    'visibility'
  ],

  siteNamespace   : 'site',
  namespaceStub   : {
    cache     : {},
    config    : {},
    sections  : {},
    section   : {},
    utilities : {}
  }

};

// allows for selection of elements with data attributes
$.extend($.expr[ ":" ], {
  data: ($.expr.createPseudo)
    ? $.expr.createPseudo(function(dataName) {
        return function(elem) {
          return !!$.data(elem, dataName);
        };
      })
    : function(elem, i, match) {
      // support: jQuery < 1.8
      return !!$.data(elem, match[ 3 ]);
    }
});


})( jQuery, window , document );
/*
 * # Semantic - Form Validation
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributor
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

$.fn.form = function(fields, parameters) {
  var
    $allModules     = $(this),

    settings        = $.extend(true, {}, $.fn.form.settings, parameters),
    validation      = $.extend({}, $.fn.form.settings.defaults, fields),

    namespace       = settings.namespace,
    metadata        = settings.metadata,
    selector        = settings.selector,
    className       = settings.className,
    error           = settings.error,

    eventNamespace  = '.' + namespace,
    moduleNamespace = 'module-' + namespace,

    moduleSelector  = $allModules.selector || '',

    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),
    returnedValue
  ;
  $allModules
    .each(function() {
      var
        $module     = $(this),
        $field      = $(this).find(selector.field),
        $group      = $(this).find(selector.group),
        $message    = $(this).find(selector.message),
        $prompt     = $(this).find(selector.prompt),

        $submit     = $(this).find(selector.submit),
        $clear      = $(this).find(selector.clear),
        $reset      = $(this).find(selector.reset),

        formErrors  = [],
        keyHeldDown = false,

        element     = this,
        instance    = $module.data(moduleNamespace),
        module
      ;

      module      = {

        initialize: function() {
          module.verbose('Initializing form validation', $module, validation, settings);
          module.bindEvents();
          module.set.defaults();
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module', instance);
          module.removeEvents();
          $module
            .removeData(moduleNamespace)
          ;
        },

        refresh: function() {
          module.verbose('Refreshing selector cache');
          $field = $module.find(selector.field);
        },

        submit: function() {
          module.verbose('Submitting form', $module);
          $module
            .submit()
          ;
        },

        attachEvents: function(selector, action) {
          action = action || 'submit';
          $(selector)
            .on('click', function(event) {
              module[action]();
              event.preventDefault();
            })
          ;
        },

        bindEvents: function() {
          if(settings.keyboardShortcuts) {
            $field
              .on('keydown' + eventNamespace, module.event.field.keydown)
            ;
          }
          $module
            .on('submit' + eventNamespace, module.validate.form)
          ;
          $field
            .on('blur' + eventNamespace, module.event.field.blur)
          ;

          // attach events to common elements
          module.attachEvents($submit, 'submit');
          module.attachEvents($reset, 'reset');
          module.attachEvents($clear, 'clear');

          $field
            .each(function() {
              var
                type       = $(this).prop('type'),
                inputEvent = module.get.changeEvent(type)
              ;
              $(this)
                .on(inputEvent + eventNamespace, module.event.field.change)
              ;
            })
          ;
        },

        clear: function() {
          $field
            .each(function () {
              var
                $field       = $(this),
                $element     = $field.parent(),
                $fieldGroup  = $field.closest($group),
                $prompt      = $fieldGroup.find(selector.prompt),
                defaultValue = $field.data(metadata.defaultValue) || '',
                isCheckbox   = $element.is(selector.uiCheckbox),
                isDropdown   = $element.is(selector.uiDropdown),
                isErrored    = $fieldGroup.hasClass(className.error)
              ;
              if(isErrored) {
                module.verbose('Resetting error on field', $fieldGroup);
                $fieldGroup.removeClass(className.error);
                $prompt.remove();
              }
              if(isDropdown) {
                module.verbose('Resetting dropdown value', $element, defaultValue);
                $element.dropdown('clear');
              }
              else if(isCheckbox) {
                $element.checkbox('uncheck');
              }
              else {
                module.verbose('Resetting field value', $field, defaultValue);
                $field.val('');
              }
            })
          ;
        },

        reset: function() {
          $field
            .each(function () {
              var
                $field       = $(this),
                $element     = $field.parent(),
                $fieldGroup  = $field.closest($group),
                $prompt      = $fieldGroup.find(selector.prompt),
                defaultValue = $field.data(metadata.defaultValue) || '',
                isCheckbox   = $element.is(selector.uiCheckbox),
                isDropdown   = $element.is(selector.uiDropdown),
                isErrored    = $fieldGroup.hasClass(className.error)
              ;
              if(isErrored) {
                module.verbose('Resetting error on field', $fieldGroup);
                $fieldGroup.removeClass(className.error);
                $prompt.remove();
              }
              if(isDropdown) {
                module.verbose('Resetting dropdown value', $element, defaultValue);
                $element.dropdown('restore defaults');
              }
              else if(isCheckbox) {
                module.verbose('Resetting checkbox value', $element, defaultValue);
                if(defaultValue === true) {
                  $element.checkbox('check');
                }
                else {
                  $element.checkbox('uncheck');
                }
              }
              else {
                module.verbose('Resetting field value', $field, defaultValue);
                $field.val(defaultValue);
              }
            })
          ;
        },

        removeEvents: function() {
          $module
            .off(eventNamespace)
          ;
          $field
            .off(eventNamespace)
          ;
          $submit
            .off(eventNamespace)
          ;
          $field
            .off(eventNamespace)
          ;
        },

        event: {
          field: {
            keydown: function(event) {
              var
                $field  = $(this),
                key     = event.which,
                keyCode = {
                  enter  : 13,
                  escape : 27
                }
              ;
              if( key == keyCode.escape) {
                module.verbose('Escape key pressed blurring field');
                $field
                  .blur()
                ;
              }
              if(!event.ctrlKey && key == keyCode.enter && $field.is(selector.input) && $field.not(selector.checkbox).length > 0 ) {
                $submit
                  .addClass(className.pressed)
                ;
                if(!keyHeldDown) {
                  $field
                    .one('keyup' + eventNamespace, module.event.field.keyup)
                  ;
                  module.submit();
                  module.debug('Enter pressed on input submitting form');
                }
                keyHeldDown = true;
              }
            },
            keyup: function() {
              keyHeldDown = false;
              $submit.removeClass(className.pressed);
            },
            blur: function() {
              var
                $field      = $(this),
                $fieldGroup = $field.closest($group)
              ;
              if( $fieldGroup.hasClass(className.error) ) {
                module.debug('Revalidating field', $field,  module.get.validation($field));
                module.validate.field( module.get.validation($field) );
              }
              else if(settings.on == 'blur' || settings.on == 'change') {
                module.validate.field( module.get.validation($field) );
              }
            },
            change: function() {
              var
                $field      = $(this),
                $fieldGroup = $field.closest($group)
              ;
              if(settings.on == 'change' || ( $fieldGroup.hasClass(className.error) && settings.revalidate) ) {
                clearTimeout(module.timer);
                module.timer = setTimeout(function() {
                  module.debug('Revalidating field', $field,  module.get.validation($field));
                  module.validate.field( module.get.validation($field) );
                }, settings.delay);
              }
            }
          }

        },

        get: {
          changeEvent: function(type) {
            if(type == 'checkbox' || type == 'radio' || type == 'hidden') {
              return 'change';
            }
            else {
              return module.get.inputEvent();
            }
          },
          inputEvent: function() {
            return (document.createElement('input').oninput !== undefined)
              ? 'input'
              : (document.createElement('input').onpropertychange !== undefined)
                ? 'propertychange'
                : 'keyup'
            ;
          },
          field: function(identifier) {
            module.verbose('Finding field with identifier', identifier);
            if( $field.filter('#' + identifier).length > 0 ) {
              return $field.filter('#' + identifier);
            }
            else if( $field.filter('[name="' + identifier +'"]').length > 0 ) {
              return $field.filter('[name="' + identifier +'"]');
            }
            else if( $field.filter('[data-' + metadata.validate + '="'+ identifier +'"]').length > 0 ) {
              return $field.filter('[data-' + metadata.validate + '="'+ identifier +'"]');
            }
            return $('<input/>');
          },
          validation: function($field) {
            var
              rules
            ;
            $.each(validation, function(fieldName, field) {
              if( module.get.field(field.identifier).get(0) == $field.get(0) ) {
                rules = field;
              }
            });
            return rules || false;
          },
          value: function (field) {
            var
              fields = [],
              results
            ;
            fields.push(field);
            results = module.get.values.call(element, fields);
            return results[field];
          },
          values: function (fields) {
            var
              values = {}
            ;
            // return all fields if no parameters
            if(!$.isArray(fields)) {
              fields = $field;
            }
            $.each(fields, function(index, field) {
              var
                $field     = (typeof field === 'string')
                  ? module.get.field(field)
                  : $(field),
                type       = $field.prop('type'),
                name       = $field.prop('name'),
                value      = $field.val(),
                isCheckbox = $field.is(selector.checkbox),
                isRadio    = $field.is(selector.radio),
                isChecked  = (isCheckbox)
                  ? $field.is(':checked')
                  : false
              ;
              if(name) {
                if(isRadio) {
                  if(isChecked) {
                    values[name] = value;
                  }
                }
                else if(isCheckbox) {
                  if(isChecked) {
                    values[name] = true;
                  }
                  else {
                    module.debug('Omitted unchecked checkbox', $field);
                    return true;
                  }
                }
                else {
                  values[name] = value;
                }
              }
            });
            return values;
          }
        },

        has: {

          field: function(identifier) {
            module.verbose('Checking for existence of a field with identifier', identifier);
            if( $field.filter('#' + identifier).length > 0 ) {
              return true;
            }
            else if( $field.filter('[name="' + identifier +'"]').length > 0 ) {
              return true;
            }
            else if( $field.filter('[data-' + metadata.validate + '="'+ identifier +'"]').length > 0 ) {
              return true;
            }
            return false;
          }

        },

        add: {
          prompt: function(identifier, errors) {
            var
              $field       = module.get.field(identifier),
              $fieldGroup  = $field.closest($group),
              $prompt      = $fieldGroup.children(selector.prompt),
              promptExists = ($prompt.length !== 0)
            ;
            errors = (typeof errors == 'string')
              ? [errors]
              : errors
            ;
            module.verbose('Adding field error state', identifier);
            $fieldGroup
              .addClass(className.error)
            ;
            if(settings.inline) {
              if(!promptExists) {
                $prompt = settings.templates.prompt(errors);
                $prompt
                  .appendTo($fieldGroup)
                ;
              }
              $prompt
                .html(errors[0])
              ;
              if(!promptExists) {
                if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
                  module.verbose('Displaying error with css transition', settings.transition);
                  $prompt.transition(settings.transition + ' in', settings.duration);
                }
                else {
                  module.verbose('Displaying error with fallback javascript animation');
                  $prompt
                    .fadeIn(settings.duration)
                  ;
                }
              }
              else {
                module.verbose('Inline errors are disabled, no inline error added', identifier);
              }
            }
          },
          errors: function(errors) {
            module.debug('Adding form error messages', errors);
            $message
              .html( settings.templates.error(errors) )
            ;
          }
        },

        remove: {
          prompt: function(field) {
            var
              $field      = module.get.field(field.identifier),
              $fieldGroup = $field.closest($group),
              $prompt     = $fieldGroup.children(selector.prompt)
            ;
            $fieldGroup
              .removeClass(className.error)
            ;
            if(settings.inline && $prompt.is(':visible')) {
              module.verbose('Removing prompt for field', field);
              if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
                $prompt.transition(settings.transition + ' out', settings.duration, function() {
                  $prompt.remove();
                });
              }
              else {
                $prompt
                  .fadeOut(settings.duration, function(){
                    $prompt.remove();
                  })
                ;
              }
            }
          }
        },

        set: {
          success: function() {
            $module
              .removeClass(className.error)
              .addClass(className.success)
            ;
          },
          defaults: function () {
            $field
              .each(function () {
                var
                  $field     = $(this),
                  isCheckbox = ($field.filter(selector.checkbox).length > 0),
                  value      = (isCheckbox)
                    ? $field.is(':checked')
                    : $field.val()
                ;
                $field.data(metadata.defaultValue, value);
              })
            ;
          },
          error: function() {
            $module
              .removeClass(className.success)
              .addClass(className.error)
            ;
          },
          value: function (field, value) {
            var
              fields = {}
            ;
            fields[field] = value;
            return module.set.values.call(element, fields);
          },
          values: function (fields) {
            if($.isEmptyObject(fields)) {
              return;
            }
            $.each(fields, function(key, value) {
              var
                $field      = module.get.field(key),
                $element    = $field.parent(),
                isCheckbox  = $element.is(selector.uiCheckbox),
                isDropdown  = $element.is(selector.uiDropdown),
                isRadio     = $field.is(selector.radio),
                fieldExists = ($field.length > 0)
              ;
              if(fieldExists) {
                if(isRadio && isCheckbox) {
                  module.verbose('Selecting radio value', value, $field);
                  $field.filter('[value="' + value + '"]')
                    .parent(selector.uiCheckbox)
                      .checkbox('check')
                  ;
                }
                else if(isCheckbox) {
                  module.verbose('Setting checkbox value', value, $element);
                  if(value === true) {
                    $element.checkbox('check');
                  }
                  else {
                    $element.checkbox('uncheck');
                  }
                }
                else if(isDropdown) {
                  module.verbose('Setting dropdown value', value, $element);
                  $element.dropdown('set selected', value);
                }
                else {
                  module.verbose('Setting field value', value, $field);
                  $field.val(value);
                }
              }
            });
            module.validate.form();
          }
        },

        validate: {

          form: function(event) {
            var
              allValid = true,
              apiRequest
            ;

            // input keydown event will fire submit repeatedly by browser default
            if(keyHeldDown) {
              return false;
            }

            // reset errors
            formErrors = [];
            $.each(validation, function(fieldName, field) {
              if( !( module.validate.field(field) ) ) {
                allValid = false;
              }
            });
            if(allValid) {
              module.debug('Form has no validation errors, submitting');
              module.set.success();
              return settings.onSuccess.call(element, event);
            }
            else {
              module.debug('Form has errors');
              module.set.error();
              if(!settings.inline) {
                module.add.errors(formErrors);
              }
              // prevent ajax submit
              if($module.data('moduleApi') !== undefined) {
                event.stopImmediatePropagation();
              }
              return settings.onFailure.call(element, formErrors);
            }
          },

          // takes a validation object and returns whether field passes validation
          field: function(field) {
            var
              $field      = module.get.field(field.identifier),
              fieldValid  = true,
              fieldErrors = []
            ;
            if($field.prop('disabled')) {
              module.debug('Field is disabled. Skipping', field.identifier);
              fieldValid = true;
            }
            else if(field.optional && $.trim($field.val()) === ''){
              module.debug('Field is optional and empty. Skipping', field.identifier);
              fieldValid = true;
            }
            else if(field.rules !== undefined) {
              $.each(field.rules, function(index, rule) {
                if( module.has.field(field.identifier) && !( module.validate.rule(field, rule) ) ) {
                  module.debug('Field is invalid', field.identifier, rule.type);
                  fieldErrors.push(rule.prompt);
                  fieldValid = false;
                }
              });
            }
            if(fieldValid) {
              module.remove.prompt(field, fieldErrors);
              settings.onValid.call($field);
            }
            else {
              formErrors = formErrors.concat(fieldErrors);
              module.add.prompt(field.identifier, fieldErrors);
              settings.onInvalid.call($field, fieldErrors);
              return false;
            }
            return true;
          },

          // takes validation rule and returns whether field passes rule
          rule: function(field, validation) {
            var
              $field        = module.get.field(field.identifier),
              type          = validation.type,
              value         = $.trim($field.val() + ''),

              bracketRegExp = /\[(.*)\]/i,
              bracket       = bracketRegExp.exec(type),
              isValid       = true,
              ancillary,
              functionType
            ;
            // if bracket notation is used, pass in extra parameters
            if(bracket !== undefined && bracket !== null) {
              ancillary    = '' + bracket[1];
              functionType = type.replace(bracket[0], '');
              isValid      = settings.rules[functionType].call(element, value, ancillary);
            }
            // normal notation
            else {
              isValid = settings.rules[type].call($field, value);
            }
            return isValid;
          }
        },

        setting: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };
      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          module.destroy();
        }
        module.initialize();
      }

    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.form.settings = {

  name              : 'Form',
  namespace         : 'form',

  debug             : false,
  verbose           : true,
  performance       : true,


  keyboardShortcuts : true,
  on                : 'submit',
  inline            : false,

  delay             : 200,
  revalidate        : true,

  transition        : 'scale',
  duration          : 200,

  onValid           : function() {},
  onInvalid         : function() {},
  onSuccess         : function() { return true; },
  onFailure         : function() { return false; },

  metadata : {
    defaultValue : 'default',
    validate     : 'validate'
  },

  selector : {
    checkbox   : 'input[type="checkbox"], input[type="radio"]',
    clear      : '.clear',
    field      : 'input, textarea, select',
    group      : '.field',
    input      : 'input',
    message    : '.error.message',
    prompt     : '.prompt.label',
    radio      : 'input[type="radio"]',
    reset      : '.reset',
    submit     : '.submit',
    uiCheckbox : '.ui.checkbox',
    uiDropdown : '.ui.dropdown'
  },

  className : {
    error   : 'error',
    label   : 'ui prompt label',
    pressed : 'down',
    success : 'success'
  },

  error: {
    method   : 'The method you called is not defined.'
  },

  templates: {

    // template that produces error message
    error: function(errors) {
      var
        html = '<ul class="list">'
      ;
      $.each(errors, function(index, value) {
        html += '<li>' + value + '</li>';
      });
      html += '</ul>';
      return $(html);
    },

    // template that produces label
    prompt: function(errors) {
      return $('<div/>')
        .addClass('ui red pointing prompt label')
        .html(errors[0])
      ;
    }
  },

  rules: {

    // checkbox checked
    checked: function() {
      return ($(this).filter(':checked').length > 0);
    },

    // value contains (text)
    contains: function(value, text) {
      text = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      return (value.search(text) !== -1);
    },

    // is most likely an email
    email: function(value){
      var
        emailRegExp = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", "i")
      ;
      return emailRegExp.test(value);
    },

    // is not empty or blank string
    empty: function(value) {
      return !(value === undefined || '' === value);
    },

    // is valid integer
    integer: function(value, range) {
      var
        intRegExp = /^\-?\d+$/,
        min,
        max,
        parts
      ;
      if(range === undefined || range === '' || range === '..') {
        // do nothing
      }
      else if(range.indexOf('..') == -1) {
        if(intRegExp.test(range)) {
          min = max = range - 0;
        }
      }
      else {
        parts = range.split('..', 2);
        if(intRegExp.test(parts[0])) {
          min = parts[0] - 0;
        }
        if(intRegExp.test(parts[1])) {
          max = parts[1] - 0;
        }
      }
      return (
        intRegExp.test(value) &&
        (min === undefined || value >= min) &&
        (max === undefined || value <= max)
      );
    },

    // is exactly value
    is: function(value, text) {
      return (value == text);
    },

    // is at least string length
    length: function(value, requiredLength) {
      return (value !== undefined)
        ? (value.length >= requiredLength)
        : false
      ;
    },

    // matches another field
    match: function(value, fieldIdentifier) {
      // use either id or name of field
      var
        $form = $(this),
        matchingValue
      ;
      if($form.find('#' + fieldIdentifier).length > 0) {
        matchingValue = $form.find('#' + fieldIdentifier).val();
      }
      else if($form.find('[name="' + fieldIdentifier +'"]').length > 0) {
        matchingValue = $form.find('[name="' + fieldIdentifier + '"]').val();
      }
      else if( $form.find('[data-validate="'+ fieldIdentifier +'"]').length > 0 ) {
        matchingValue = $form.find('[data-validate="'+ fieldIdentifier +'"]').val();
      }
      return (matchingValue !== undefined)
        ? ( value.toString() == matchingValue.toString() )
        : false
      ;
    },

    // string length is less than max length
    maxLength: function(value, maxLength) {
      return (value !== undefined)
        ? (value.length <= maxLength)
        : false
      ;
    },

    // value is not exactly notValue
    not: function(value, notValue) {
      return (value != notValue);
    },

    // value is most likely url
    url: function(value) {
      var
        urlRegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      ;
      return urlRegExp.test(value);
    }
  }

};

})( jQuery, window , document );

/*
 * # Semantic - Accordion
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributor
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

"use strict";

$.fn.accordion = function(parameters) {
  var
    $allModules     = $(this),

    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),

    requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(callback) { setTimeout(callback, 0); },

    returnedValue
  ;
  $allModules
    .each(function() {
      var
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.accordion.settings, parameters)
          : $.extend({}, $.fn.accordion.settings),

        className       = settings.className,
        namespace       = settings.namespace,
        selector        = settings.selector,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,
        moduleSelector  = $allModules.selector || '',

        $module  = $(this),
        $title   = $module.find(selector.title),
        $content = $module.find(selector.content),

        element  = this,
        instance = $module.data(moduleNamespace),
        observer,
        module
      ;

      module = {

        initialize: function() {
          module.debug('Initializing accordion with bound events', $module);
          $module
            .on('click' + eventNamespace, selector.title, module.event.click)
          ;
          module.observeChanges();
          module.instantiate();
        },

        instantiate: function() {
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.debug('Destroying previous accordion for', $module);
          $module
            .removeData(moduleNamespace)
          ;
          $title
            .off(eventNamespace)
          ;
        },

        refresh: function() {
          $title   = $module.find(selector.title);
          $content = $module.find(selector.content);
        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            observer = new MutationObserver(function(mutations) {
              module.debug('DOM tree modified, updating selector cache');
              module.refresh();
            });
            observer.observe(element, {
              childList : true,
              subtree   : true
            });
            module.debug('Setting up mutation observer', observer);
          }
        },


        event: {
          click: function() {
            module.toggle.call(this);
          }
        },

        toggle: function(query) {
          var
            $activeTitle = (query !== undefined)
              ? (typeof query === 'number')
                ? $title.eq(query)
                : $(query)
              : $(this),
            $activeContent = $activeTitle.next($content),
            contentIsOpen  = $activeContent.is(':visible')
          ;
          module.debug('Toggling visibility of content', $activeTitle);
          if(contentIsOpen) {
            if(settings.collapsible) {
              module.close.call($activeTitle);
            }
            else {
              module.debug('Cannot close accordion content collapsing is disabled');
            }
          }
          else {
              module.open.call($activeTitle);
          }
        },

        open: function(query) {
          var
            $activeTitle = (query !== undefined)
              ? (typeof query === 'number')
                ? $title.eq(query)
                : $(query)
              : $(this),
            $activeContent     = $activeTitle.next($content),
            currentlyAnimating = $activeContent.is(':animated'),
            currentlyActive    = $activeContent.hasClass(className.active)
          ;
          if(!currentlyAnimating && !currentlyActive) {
            module.debug('Opening accordion content', $activeTitle);
            if(settings.exclusive) {
              module.closeOthers.call($activeTitle);
            }
            $activeTitle
              .addClass(className.active)
            ;
            if(settings.animateChildren) {
              if($.fn.transition !== undefined && $module.transition('is supported')) {
                $activeContent
                  .children()
                    .transition({
                      animation  : 'fade in',
                      useFailSafe : true,
                      debug      : settings.debug,
                      verbose    : settings.verbose,
                      duration   : settings.duration
                    })
                ;
              }
              else {
                $activeContent
                  .children()
                    .stop()
                    .animate({
                      opacity: 1
                    }, settings.duration, module.resetOpacity)
                ;
              }
            }
            $activeContent
              .stop()
              .slideDown(settings.duration, settings.easing, function() {
                $activeContent
                  .addClass(className.active)
                ;
                module.reset.display.call(this);
                settings.onOpen.call(this);
                settings.onChange.call(this);
              })
            ;
          }
        },

        close: function(query) {
          var
            $activeTitle = (query !== undefined)
              ? (typeof query === 'number')
                ? $title.eq(query)
                : $(query)
              : $(this),
            $activeContent = $activeTitle.next($content),
            isActive       = $activeContent.hasClass(className.active)
          ;
          if(isActive) {
            module.debug('Closing accordion content', $activeContent);
            $activeTitle
              .removeClass(className.active)
            ;
            $activeContent
              .removeClass(className.active)
              .show()
            ;
            if(settings.animateChildren) {
              if($.fn.transition !== undefined && $module.transition('is supported')) {
                $activeContent
                  .children()
                    .transition({
                      animation   : 'fade out',
                      useFailSafe : true,
                      debug       : settings.debug,
                      verbose     : settings.verbose,
                      duration    : settings.duration
                    })
                ;
              }
              else {
                $activeContent
                  .children()
                    .stop()
                    .animate({
                      opacity: 0
                    }, settings.duration, module.resetOpacity)
                ;
              }
            }
            $activeContent
              .stop()
              .slideUp(settings.duration, settings.easing, function() {
                module.reset.display.call(this);
                settings.onClose.call(this);
                settings.onChange.call(this);
              })
            ;
          }
        },

        closeOthers: function(index) {
          var
            $activeTitle = (index !== undefined)
              ? $title.eq(index)
              : $(this),
            $parentTitles    = $activeTitle.parents(selector.content).prev(selector.title),
            $activeAccordion = $activeTitle.closest(selector.accordion),
            activeSelector   = selector.title + '.' + className.active + ':visible',
            activeContent    = selector.content + '.' + className.active + ':visible',
            $openTitles,
            $nestedTitles,
            $openContents
          ;
          if(settings.closeNested) {
            $openTitles   = $activeAccordion.find(activeSelector).not($parentTitles);
            $openContents = $openTitles.next($content);
          }
          else {
            $openTitles   = $activeAccordion.find(activeSelector).not($parentTitles);
            $nestedTitles = $activeAccordion.find(activeContent).find(activeSelector).not($parentTitles);
            $openTitles   = $openTitles.not($nestedTitles);
            $openContents = $openTitles.next($content);
          }
          if( ($openTitles.length > 0) ) {
            module.debug('Exclusive enabled, closing other content', $openTitles);
            $openTitles
              .removeClass(className.active)
            ;
            if(settings.animateChildren) {
              if($.fn.transition !== undefined && $module.transition('is supported')) {
                $openContents
                  .children()
                    .transition({
                      animation   : 'fade out',
                      useFailSafe : true,
                      debug       : settings.debug,
                      verbose     : settings.verbose,
                      duration    : settings.duration
                    })
                ;
              }
              else {
                $openContents
                  .children()
                    .stop()
                    .animate({
                      opacity: 0
                    }, settings.duration, module.resetOpacity)
                ;
              }
            }
            $openContents
              .stop()
              .slideUp(settings.duration , settings.easing, function() {
                $(this).removeClass(className.active);
                module.reset.display.call(this);
              })
            ;
          }
        },

        reset: {

          display: function() {
            module.verbose('Removing inline display from element', this);
            $(this).css('display', '');
            if( $(this).attr('style') === '') {
              $(this)
                .attr('style', '')
                .removeAttr('style')
              ;
            }
          },

          opacity: function() {
            module.verbose('Removing inline opacity from element', this);
            $(this).css('opacity', '');
            if( $(this).attr('style') === '') {
              $(this)
                .attr('style', '')
                .removeAttr('style')
              ;
            }
          },

        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          module.debug('Changing internal', name, value);
          if(value !== undefined) {
            if( $.isPlainObject(name) ) {
              $.extend(true, module, name);
            }
            else {
              module[name] = value;
            }
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };
      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          module.destroy();
        }
        module.initialize();
      }
    })
  ;
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.accordion.settings = {

  name            : 'Accordion',
  namespace       : 'accordion',

  debug           : false,
  verbose         : true,
  performance     : true,

  exclusive       : true,
  collapsible     : true,
  closeNested     : false,
  animateChildren : true,

  duration        : 500,
  easing          : 'easeOutQuint',

  onOpen          : function(){},
  onClose         : function(){},
  onChange        : function(){},

  error: {
    method : 'The method you called is not defined'
  },

  className   : {
    active : 'active'
  },

  selector    : {
    accordion : '.accordion',
    title     : '.title',
    content   : '.content'
  }

};

// Adds easing
$.extend( $.easing, {
  easeOutQuint: function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  }
});

})( jQuery, window , document );


/*
 * # Semantic - Modal
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributor
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.modal = function(parameters) {
  var
    $allModules    = $(this),
    $window        = $(window),
    $document      = $(document),
    $body          = $('body'),

    moduleSelector = $allModules.selector || '',

    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),

    requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(callback) { setTimeout(callback, 0); },

    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings    = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.modal.settings, parameters)
          : $.extend({}, $.fn.modal.settings),

        selector        = settings.selector,
        className       = settings.className,
        namespace       = settings.namespace,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $module         = $(this),
        $context        = $(settings.context),
        $close          = $module.find(selector.close),

        $allModals,
        $otherModals,
        $focusedElement,
        $dimmable,
        $dimmer,

        element         = this,
        instance        = $module.data(moduleNamespace),

        elementNamespace,
        id,
        observer,
        module
      ;
      module  = {

        initialize: function() {
          module.verbose('Initializing dimmer', $context);

          module.create.id();
          module.create.dimmer();
          module.refreshModals();

          module.verbose('Attaching close events', $close);
          module.bind.events();
          module.observeChanges();
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of modal');
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        create: {
          dimmer: function() {
            var
              defaultSettings = {
                debug      : settings.debug,
                dimmerName : 'modals',
                duration   : {
                  show     : settings.duration,
                  hide     : settings.duration
                }
              },
              dimmerSettings = $.extend(true, defaultSettings, settings.dimmerSettings)
            ;
            if($.fn.dimmer === undefined) {
              module.error(error.dimmer);
              return;
            }
            module.debug('Creating dimmer with settings', dimmerSettings);
            $dimmable = $context.dimmer(dimmerSettings);
            if(settings.detachable) {
              module.verbose('Modal is detachable, moving content into dimmer');
              $dimmable.dimmer('add content', $module);
            }
            $dimmer = $dimmable.dimmer('get dimmer');
          },
          id: function() {
            module.verbose('Creating unique id for element');
            id = module.get.uniqueID();
            elementNamespace = '.' + id;
          }
        },

        destroy: function() {
          module.verbose('Destroying previous modal');
          $module
            .removeData(moduleNamespace)
            .off(eventNamespace)
          ;
          $window.off(elementNamespace);
          $close.off(eventNamespace);
          $context.dimmer('destroy');
        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            observer = new MutationObserver(function(mutations) {
              module.debug('DOM tree modified, refreshing');
              module.refresh();
            });
            observer.observe(element, {
              childList : true,
              subtree   : true
            });
            module.debug('Setting up mutation observer', observer);
          }
        },

        refresh: function() {
          module.remove.scrolling();
          module.cacheSizes();
          module.set.screenHeight();
          module.set.type();
          module.set.position();
        },

        refreshModals: function() {
          $otherModals = $module.siblings(selector.modal);
          $allModals   = $otherModals.add($module);
        },

        attachEvents: function(selector, event) {
          var
            $toggle = $(selector)
          ;
          event = $.isFunction(module[event])
            ? module[event]
            : module.toggle
          ;
          if($toggle.length > 0) {
            module.debug('Attaching modal events to element', selector, event);
            $toggle
              .off(eventNamespace)
              .on('click' + eventNamespace, event)
            ;
          }
          else {
            module.error(error.notFound, selector);
          }
        },

        bind: {
          events: function() {
            $close
              .on('click' + eventNamespace, module.event.close)
            ;
            $window
              .on('resize' + elementNamespace, module.event.resize)
            ;
          }
        },

        get: {
          uniqueID: function() {
            return (Math.random().toString(16) + '000000000').substr(2,8);
          }
        },

        event: {
          close: function() {
            module.verbose('Closing element pressed');
            if( $(this).is(selector.approve) ) {
              if(settings.onApprove.call(element) !== false) {
                module.hide();
              }
              else {
                module.verbose('Approve callback returned false cancelling hide');
              }
            }
            else if( $(this).is(selector.deny) ) {
              if(settings.onDeny.call(element) !== false) {
                module.hide();
              }
              else {
                module.verbose('Deny callback returned false cancelling hide');
              }
            }
            else {
              module.hide();
            }
          },
          click: function(event) {
            if( $(event.target).closest($module).length === 0 ) {
              module.debug('Dimmer clicked, hiding all modals');
              if( module.is.active() ) {
                module.remove.clickaway();
                if(settings.allowMultiple) {
                  module.hide();
                }
                else {
                  module.hideAll();
                }
              }
            }
          },
          debounce: function(method, delay) {
            clearTimeout(module.timer);
            module.timer = setTimeout(method, delay);
          },
          keyboard: function(event) {
            var
              keyCode   = event.which,
              escapeKey = 27
            ;
            if(keyCode == escapeKey) {
              if(settings.closable) {
                module.debug('Escape key pressed hiding modal');
                module.hide();
              }
              else {
                module.debug('Escape key pressed, but closable is set to false');
              }
              event.preventDefault();
            }
          },
          resize: function() {
            if( $dimmable.dimmer('is active') ) {
              requestAnimationFrame(module.refresh);
            }
          }
        },

        toggle: function() {
          if( module.is.active() || module.is.animating() ) {
            module.hide();
          }
          else {
            module.show();
          }
        },

        show: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.refreshModals();
          module.showModal(callback);
        },

        hide: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.refreshModals();
          module.hideModal(callback);
        },

        showModal: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.is.animating() || !module.is.active() ) {

            module.showDimmer();
            module.cacheSizes();
            module.set.position();
            module.set.screenHeight();
            module.set.type();
            module.set.clickaway();

            if( !settings.allowMultiple && $otherModals.filter(':visible').length > 0) {
              module.debug('Other modals visible, queueing show animation');
              module.hideOthers(module.showModal);
            }
            else {
              settings.onShow.call(element);
              if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
                module.debug('Showing modal with css animations');
                $module
                  .transition({
                    debug       : settings.debug,
                    animation   : settings.transition + ' in',
                    queue       : settings.queue,
                    duration    : settings.duration,
                    useFailSafe : true,
                    onComplete : function() {
                      settings.onVisible.apply(element);
                      module.add.keyboardShortcuts();
                      module.save.focus();
                      module.set.active();
                      module.set.autofocus();
                      callback();
                    }
                  })
                ;
              }
              else {
                module.debug('Showing modal with javascript');
                $module
                  .fadeIn(settings.duration, settings.easing, function() {
                    settings.onVisible.apply(element);
                    module.add.keyboardShortcuts();
                    module.save.focus();
                    module.set.active();
                    callback();
                  })
                ;
              }
            }
          }
          else {
            module.debug('Modal is already visible');
          }
        },

        hideModal: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.debug('Hiding modal');
          settings.onHide.call(element);

          if( module.is.animating() || module.is.active() ) {
            if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
              module.remove.active();
              $module
                .transition({
                  debug       : settings.debug,
                  animation   : settings.transition + ' out',
                  queue       : settings.queue,
                  duration    : settings.duration,
                  useFailSafe : true,
                  onStart     : function() {
                    if( !module.othersActive() ) {
                      module.hideDimmer();
                    }
                    module.remove.keyboardShortcuts();
                  },
                  onComplete : function() {
                    settings.onHidden.call(element);
                    module.restore.focus();
                    callback();
                  }
                })
              ;
            }
            else {
              module.remove.active();
              if( !module.othersActive() ) {
                module.hideDimmer();
              }
              module.remove.keyboardShortcuts();
              $module
                .fadeOut(settings.duration, settings.easing, function() {
                  settings.onHidden.call(element);
                  module.restore.focus();
                  callback();
                })
              ;
            }
          }
        },

        showDimmer: function() {
          if($dimmable.dimmer('is animating') || !$dimmable.dimmer('is active') ) {
            module.debug('Showing dimmer');
            $dimmable.dimmer('show');
          }
          else {
            module.debug('Dimmer already visible');
          }
        },

        hideDimmer: function() {
          if( $dimmable.dimmer('is animating') || ($dimmable.dimmer('is active')) ) {
            $dimmable.dimmer('hide', function() {
              if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
                module.remove.clickaway();
                module.remove.screenHeight();
              }
            });
          }
          else {
            module.debug('Dimmer is not visible cannot hide');
            return;
          }
        },

        hideAll: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( $allModals.is(':visible') ) {
            module.debug('Hiding all visible modals');
            module.hideDimmer();
            $allModals
              .filter(':visible')
                .modal('hide modal', callback)
            ;
          }
        },

        hideOthers: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( $otherModals.is(':visible') ) {
            module.debug('Hiding other modals', $otherModals);
            $otherModals
              .filter(':visible')
                .modal('hide modal', callback)
            ;
          }
        },

        othersActive: function() {
          return ($otherModals.filter('.' + className.active).length > 0);
        },

        add: {
          keyboardShortcuts: function() {
            module.verbose('Adding keyboard shortcuts');
            $document
              .on('keyup' + eventNamespace, module.event.keyboard)
            ;
          }
        },

        save: {
          focus: function() {
            $focusedElement = $(document.activeElement).blur();
          }
        },

        restore: {
          focus: function() {
            if($focusedElement && $focusedElement.length > 0) {
              $focusedElement.focus();
            }
          }
        },

        remove: {
          active: function() {
            $module.removeClass(className.active);
          },
          clickaway: function() {
            if(settings.closable) {
              $dimmer
                .off('click' + elementNamespace)
              ;
            }
          },
          screenHeight: function() {
            if(module.cache.height > module.cache.pageHeight) {
              module.debug('Removing page height');
              $body
                .css('height', '')
              ;
            }
          },
          keyboardShortcuts: function() {
            module.verbose('Removing keyboard shortcuts');
            $document
              .off('keyup' + eventNamespace)
            ;
          },
          scrolling: function() {
            $dimmable.removeClass(className.scrolling);
            $module.removeClass(className.scrolling);
          }
        },

        cacheSizes: function() {
          var
            modalHeight = $module.outerHeight()
          ;
          if(module.cache === undefined || modalHeight !== 0) {
            module.cache = {
              pageHeight    : $(document).outerHeight(),
              height        : modalHeight + settings.offset,
              contextHeight : (settings.context == 'body')
                ? $(window).height()
                : $dimmable.height()
            };
          }
          module.debug('Caching modal and container sizes', module.cache);
        },

        can: {
          fit: function() {
            return (module.cache.height < module.cache.contextHeight);
          }
        },

        is: {
          active: function() {
            return $module.hasClass(className.active);
          },
          animating: function() {
            return $module.transition('is supported')
              ? $module.transition('is animating')
              : $module.is(':visible')
            ;
          },
          scrolling: function() {
            return $dimmable.hasClass(className.scrolling);
          },
          modernBrowser: function() {
            // appName for IE11 reports 'Netscape' can no longer use
            return !(window.ActiveXObject || "ActiveXObject" in window);
          }
        },

        set: {
          autofocus: function() {
            if(settings.autofocus) {
              var
                $inputs    = $module.find(':input:visible'),
                $autofocus = $inputs.filter('[autofocus]'),
                $input     = ($autofocus.length > 0)
                  ? $autofocus
                  : $inputs
              ;
              $input.first().focus();
            }
          },
          clickaway: function() {
            if(settings.closable) {
              $dimmer
                .on('click' + elementNamespace, module.event.click)
              ;
            }
          },
          screenHeight: function() {
            if(module.cache.height > module.cache.pageHeight) {
              module.debug('Modal is taller than page content, resizing page height');
              $body
                .css('height', module.cache.height + settings.padding)
              ;
            }
            else {
              $body.css('height', '');
            }
          },
          active: function() {
            $module.addClass(className.active);
          },
          scrolling: function() {
            $dimmable.addClass(className.scrolling);
            $module.addClass(className.scrolling);
          },
          type: function() {
            if(module.can.fit()) {
              module.verbose('Modal fits on screen');
              if(!module.othersActive) {
                module.remove.scrolling();
              }
            }
            else {
              module.verbose('Modal cannot fit on screen setting to scrolling');
              module.set.scrolling();
            }
          },
          position: function() {
            module.verbose('Centering modal on page', module.cache);
            if(module.can.fit()) {
              $module
                .css({
                  top: '',
                  marginTop: -(module.cache.height / 2)
                })
              ;
            }
            else {
              $module
                .css({
                  marginTop : '',
                  top       : $document.scrollTop()
                })
              ;
            }
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          module.destroy();
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.modal.settings = {

  name           : 'Modal',
  namespace      : 'modal',

  debug          : false,
  verbose        : true,
  performance    : true,

  allowMultiple  : false,
  detachable     : true,
  closable       : true,
  autofocus      : true,

  dimmerSettings : {
    closable : false,
    useCSS   : true
  },

  context        : 'body',

  queue          : false,
  duration       : 500,
  easing         : 'easeOutExpo',
  offset         : 0,
  transition     : 'scale',

  padding        : 30,

  onShow         : function(){},
  onHide         : function(){},

  onVisible      : function(){},
  onHidden       : function(){},

  onApprove      : function(){ return true; },
  onDeny         : function(){ return true; },

  selector    : {
    close    : '.close, .actions .button',
    approve  : '.actions .positive, .actions .approve, .actions .ok',
    deny     : '.actions .negative, .actions .deny, .actions .cancel',
    modal    : '.ui.modal'
  },
  error : {
    dimmer    : 'UI Dimmer, a required component is not included in this page',
    method    : 'The method you called is not defined.',
    notFound  : 'The element you specified could not be found'
  },
  className : {
    active    : 'active',
    animating : 'animating',
    scrolling : 'scrolling'
  }
};


})( jQuery, window , document );

/*
 * # Semantic - Popup
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributor
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

"use strict";

$.fn.popup = function(parameters) {
  var
    $allModules    = $(this),
    $document      = $(document),

    moduleSelector = $allModules.selector || '',

    hasTouch       = ('ontouchstart' in document.documentElement),
    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),

    returnedValue
  ;
  $allModules
    .each(function() {
      var
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.popup.settings, parameters)
          : $.extend({}, $.fn.popup.settings),

        selector           = settings.selector,
        className          = settings.className,
        error              = settings.error,
        metadata           = settings.metadata,
        namespace          = settings.namespace,

        eventNamespace     = '.' + settings.namespace,
        moduleNamespace    = 'module-' + namespace,

        $module            = $(this),
        $context           = $(settings.context),
        $target            = (settings.target)
          ? $(settings.target)
          : $module,

        $window            = $(window),
        $body              = $('body'),
        $popup,
        $offsetParent,

        searchDepth        = 0,
        triedPositions     = false,

        element            = this,
        instance           = $module.data(moduleNamespace),
        module
      ;

      module = {

        // binds events
        initialize: function() {
          module.debug('Initializing module', $module);
          if(settings.on == 'click') {
            $module
              .on('click' + eventNamespace, module.toggle)
            ;
          }
          else if( module.get.startEvent() ) {
            $module
              .on(module.get.startEvent() + eventNamespace, module.event.start)
              .on(module.get.endEvent() + eventNamespace, module.event.end)
            ;
          }
          if(settings.target) {
            module.debug('Target set to element', $target);
          }
          $window
            .on('resize' + eventNamespace, module.event.resize)
          ;
          if( !module.exists() && settings.preserve) {
            module.create();
          }
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        refresh: function() {
          if(settings.popup) {
            $popup = $(settings.popup).eq(0);
          }
          else {
            if(settings.inline) {
              $popup = $target.next(selector.popup).eq(0);
            }
          }
          if(settings.popup) {
            $popup.addClass(className.loading);
            $offsetParent = module.get.offsetParent();
            $popup.removeClass(className.loading);
            if(settings.movePopup && module.has.popup() && module.get.offsetParent($popup)[0] !== $offsetParent[0]) {
              module.debug('Moving popup to the same offset parent as activating element');
              $popup
                .detach()
                .appendTo($offsetParent)
              ;
            }
          }
          else {
            $offsetParent = (settings.inline)
              ? module.get.offsetParent($target)
              : module.has.popup()
                ? module.get.offsetParent($popup)
                : $body
            ;
          }
          if( $offsetParent.is('html') ) {
            module.debug('Setting page as offset parent');
            $offsetParent = $body;
          }
        },

        reposition: function() {
          module.refresh();
          module.set.position();
        },

        destroy: function() {
          module.debug('Destroying previous module');
          if($popup && !settings.preserve) {
            module.removePopup();
          }
          clearTimeout(module.hideTimer);
          clearTimeout(module.showTimer);
          $module
            .off(eventNamespace)
            .removeData(moduleNamespace)
          ;
        },

        event: {
          start:  function(event) {
            var
              delay = ($.isPlainObject(settings.delay))
                ? settings.delay.show
                : settings.delay
            ;
            clearTimeout(module.hideTimer);
            module.showTimer = setTimeout(function() {
              if(module.is.hidden() && !( module.is.active() && module.is.dropdown()) ) {
                module.show();
              }
            }, delay);
          },
          end:  function() {
            var
              delay = ($.isPlainObject(settings.delay))
                ? settings.delay.hide
                : settings.delay
            ;
            clearTimeout(module.showTimer);
            module.hideTimer = setTimeout(function() {
              if(module.is.visible() ) {
                module.hide();
              }
            }, delay);
          },
          resize: function() {
            if( module.is.visible() ) {
              module.set.position();
            }
          }
        },

        // generates popup html from metadata
        create: function() {
          var
            html      = $module.data(metadata.html)      || settings.html,
            variation = $module.data(metadata.variation) || settings.variation,
            title     = $module.data(metadata.title)     || settings.title,
            content   = $module.data(metadata.content)   || $module.attr('title') || settings.content
          ;
          if(html || content || title) {
            module.debug('Creating pop-up html');
            if(!html) {
              html = settings.templates.popup({
                title   : title,
                content : content
              });
            }
            $popup = $('<div/>')
              .addClass(className.popup)
              .addClass(variation)
              .html(html)
            ;
            if(variation) {
              $popup
                .addClass(variation)
              ;
            }
            if(settings.inline) {
              module.verbose('Inserting popup element inline', $popup);
              $popup
                .insertAfter($module)
              ;
            }
            else {
              module.verbose('Appending popup element to body', $popup);
              $popup
                .appendTo( $context )
              ;
            }
            module.refresh();
            if(settings.hoverable) {
              module.bind.popup();
            }
            settings.onCreate.call($popup, element);
          }
          else if($target.next(selector.popup).length !== 0) {
            module.verbose('Pre-existing popup found');
            settings.inline = true;
            settings.popup  = $target.next(selector.popup);
            module.refresh();
            if(settings.hoverable) {
              module.bind.popup();
            }
          }
          else if(settings.popup) {
            module.verbose('Used popup specified in settings');
            module.refresh();
            if(settings.hoverable) {
              module.bind.popup();
            }
          }
          else {
            module.debug('No content specified skipping display', element);
          }
        },

        // determines popup state
        toggle: function() {
          module.debug('Toggling pop-up');
          if( module.is.hidden() ) {
            module.debug('Popup is hidden, showing pop-up');
            module.unbind.close();
            module.hideAll();
            module.show();
          }
          else {
            module.debug('Popup is visible, hiding pop-up');
            module.hide();
          }
        },

        show: function(callback) {
          callback = $.isFunction(callback) ? callback : function(){};
          module.debug('Showing pop-up', settings.transition);
          if( !module.exists() ) {
            module.create();
          }
          else if(!settings.preserve && !settings.popup) {
            module.refresh();
          }
          if( $popup && module.set.position() ) {
            module.save.conditions();
            module.animate.show(callback);
          }
        },


        hide: function(callback) {
          callback = $.isFunction(callback) ? callback : function(){};
          module.remove.visible();
          module.unbind.close();
          if( module.is.visible() ) {
            module.restore.conditions();
            module.animate.hide(callback);
          }
        },

        hideAll: function() {
          $(selector.popup)
            .filter(':visible')
              .transition(settings.transition)
          ;
        },

        hideGracefully: function(event) {
          // don't close on clicks inside popup
          if(event && $(event.target).closest(selector.popup).length === 0) {
            module.debug('Click occurred outside popup hiding popup');
            module.hide();
          }
          else {
            module.debug('Click was inside popup, keeping popup open');
          }
        },

        exists: function() {
          if(!$popup) {
            return false;
          }
          if(settings.inline || settings.popup) {
            return ( module.has.popup() );
          }
          else {
            return ( $popup.closest($context).length >= 1 )
              ? true
              : false
            ;
          }
        },

        removePopup: function() {
          module.debug('Removing popup', $popup);
          if( module.has.popup() && !settings.popup) {
            $popup.remove();
            $popup = undefined;
          }
          settings.onRemove.call($popup, element);
        },

        save: {
          conditions: function() {
            module.cache = {
              title: $module.attr('title')
            };
            if (module.cache.title) {
              $module.removeAttr('title');
            }
            module.verbose('Saving original attributes', module.cache.title);
          }
        },
        restore: {
          conditions: function() {
            if(module.cache && module.cache.title) {
              $module.attr('title', module.cache.title);
              module.verbose('Restoring original attributes', module.cache.title);
            }
            return true;
          }
        },
        animate: {
          show: function(callback) {
            callback = $.isFunction(callback) ? callback : function(){};
            if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
              module.set.visible();
              $popup
                .transition({
                  animation  : settings.transition + ' in',
                  queue      : false,
                  debug      : settings.debug,
                  verbose    : settings.verbose,
                  duration   : settings.duration,
                  onComplete : function() {
                    module.bind.close();
                    callback.call($popup, element);
                    settings.onVisible.call($popup, element);
                  }
                })
              ;
            }
            else {
              module.set.visible();
              $popup
                .stop()
                .fadeIn(settings.duration, settings.easing, function() {
                  module.bind.close();
                  callback.call($popup, element);
                  settings.onVisible.call($popup, element);
                })
              ;
            }
            settings.onShow.call($popup, element);
          },
          hide: function(callback) {
            callback = $.isFunction(callback) ? callback : function(){};
            module.debug('Hiding pop-up');
            if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
              $popup
                .transition({
                  animation  : settings.transition + ' out',
                  queue      : false,
                  duration   : settings.duration,
                  debug      : settings.debug,
                  verbose    : settings.verbose,
                  onComplete : function() {
                    module.reset();
                    callback.call($popup, element);
                    settings.onHidden.call($popup, element);
                  }
                })
              ;
            }
            else {
              $popup
                .stop()
                .fadeOut(settings.duration, settings.easing, function() {
                  module.reset();
                  callback.call($popup, element);
                  settings.onHidden.call($popup, element);
                })
              ;
            }
            settings.onHide.call($popup, element);
          }
        },

        get: {
          startEvent: function() {
            if(settings.on == 'hover') {
              return 'mouseenter';
            }
            else if(settings.on == 'focus') {
              return 'focus';
            }
            return false;
          },
          endEvent: function() {
            if(settings.on == 'hover') {
              return 'mouseleave';
            }
            else if(settings.on == 'focus') {
              return 'blur';
            }
            return false;
          },
          offsetParent: function($target) {
            var
              element = ($target !== undefined)
                ? $target[0]
                : $module[0],
              parentNode = element.parentNode,
              $node    = $(parentNode)
            ;
            if(parentNode) {
              var
                is2D     = ($node.css('transform') === 'none'),
                isStatic = ($node.css('position') === 'static'),
                isHTML   = $node.is('html')
              ;
              while(parentNode && !isHTML && isStatic && is2D) {
                parentNode = parentNode.parentNode;
                $node    = $(parentNode);
                is2D     = ($node.css('transform') === 'none');
                isStatic = ($node.css('position') === 'static');
                isHTML   = $node.is('html');
              }
            }
            return ($node && $node.length > 0)
              ? $node
              : $()
            ;
          },
          offstagePosition: function(position) {
            var
              boundary  = {
                top    : $(window).scrollTop(),
                bottom : $(window).scrollTop() + $(window).height(),
                left   : 0,
                right  : $(window).width()
              },
              popup     = {
                width  : $popup.width(),
                height : $popup.height(),
                offset : $popup.offset()
              },
              offstage  = {},
              offstagePositions = []
            ;
            position = position || false;
            if(popup.offset && position) {
              module.verbose('Checking if outside viewable area', popup.offset);
              offstage = {
                top    : (popup.offset.top < boundary.top),
                bottom : (popup.offset.top + popup.height > boundary.bottom),
                right  : (popup.offset.left + popup.width > boundary.right),
                left   : (popup.offset.left < boundary.left)
              };
            }
            // return only boundaries that have been surpassed
            $.each(offstage, function(direction, isOffstage) {
              if(isOffstage) {
                offstagePositions.push(direction);
              }
            });
            return (offstagePositions.length > 0)
              ? offstagePositions.join(' ')
              : false
            ;
          },
          positions: function() {
            return {
              'top left'      : false,
              'top center'    : false,
              'top right'     : false,
              'bottom left'   : false,
              'bottom center' : false,
              'bottom right'  : false,
              'left center'   : false,
              'right center'  : false
            };
          },
          nextPosition: function(position) {
            var
              positions          = position.split(' '),
              verticalPosition   = positions[0],
              horizontalPosition = positions[1],
              opposite = {
                top    : 'bottom',
                bottom : 'top',
                left   : 'right',
                right  : 'left'
              },
              adjacent = {
                left   : 'center',
                center : 'right',
                right  : 'left'
              },
              backup = {
                'top left'      : 'top center',
                'top center'    : 'top right',
                'top right'     : 'right center',
                'right center'  : 'bottom right',
                'bottom right'  : 'bottom center',
                'bottom center' : 'bottom left',
                'bottom left'   : 'left center',
                'left center'   : 'top left'
              },
              adjacentsAvailable = (verticalPosition == 'top' || verticalPosition == 'bottom'),
              oppositeTried = false,
              adjacentTried = false,
              nextPosition  = false
            ;
            if(!triedPositions) {
              module.verbose('All available positions available');
              triedPositions = module.get.positions();
            }

            module.debug('Recording last position tried', position);
            triedPositions[position] = true;

            if(settings.prefer === 'opposite') {
              nextPosition  = [opposite[verticalPosition], horizontalPosition];
              nextPosition  = nextPosition.join(' ');
              oppositeTried = (triedPositions[nextPosition] === true);
              module.debug('Trying opposite strategy', nextPosition);
            }
            if((settings.prefer === 'adjacent') && adjacentsAvailable ) {
              nextPosition  = [verticalPosition, adjacent[horizontalPosition]];
              nextPosition  = nextPosition.join(' ');
              adjacentTried = (triedPositions[nextPosition] === true);
              module.debug('Trying adjacent strategy', nextPosition);
            }
            if(adjacentTried || oppositeTried) {
              module.debug('Using backup position', nextPosition);
              nextPosition = backup[position];
            }
            return nextPosition;
          }
        },

        set: {
          position: function(position, arrowOffset) {
            var
              windowWidth   = $(window).width(),
              windowHeight  = $(window).height(),

              targetWidth   = $target.outerWidth(),
              targetHeight  = $target.outerHeight(),

              popupWidth    = $popup.outerWidth(),
              popupHeight   = $popup.outerHeight(),

              parentWidth   = $offsetParent.outerWidth(),
              parentHeight  = $offsetParent.outerHeight(),

              distanceAway  = settings.distanceAway,

              targetElement = $target[0],

              marginTop     = (settings.inline)
                ? parseInt( window.getComputedStyle(targetElement).getPropertyValue('margin-top'), 10)
                : 0,
              marginLeft    = (settings.inline)
                ? parseInt( window.getComputedStyle(targetElement).getPropertyValue(module.is.rtl() ? 'margin-right' : 'margin-left'), 10)
                : 0,

              target        = (settings.inline || settings.popup)
                ? $target.position()
                : $target.offset(),

              computedPosition,
              positioning,
              offstagePosition
            ;
            position    = position    || $module.data(metadata.position)    || settings.position;
            arrowOffset = arrowOffset || $module.data(metadata.offset)      || settings.offset;

            if(searchDepth == settings.maxSearchDepth && settings.lastResort) {
              module.debug('Using last resort position to display', settings.lastResort);
              position = settings.lastResort;
            }

            if(settings.inline) {
              module.debug('Adding targets margin to calculation');
              if(position == 'left center' || position == 'right center') {
                arrowOffset  += marginTop;
                distanceAway += -marginLeft;
              }
              else if (position == 'top left' || position == 'top center' || position == 'top right') {
                arrowOffset  += marginLeft;
                distanceAway -= marginTop;
              }
              else {
                arrowOffset  += marginLeft;
                distanceAway += marginTop;
              }
            }
            module.debug('Calculating popup positioning', position);

            computedPosition = position;
            if (module.is.rtl()) {
              computedPosition = computedPosition.replace(/left|right/g, function (match) {
                return (match == 'left')
                  ? 'right'
                  : 'left'
                ;
              });
              module.debug('RTL: Popup positioning updated', computedPosition);
            }
            switch (computedPosition) {
              case 'top left':
                positioning = {
                  top    : 'auto',
                  bottom : parentHeight - target.top + distanceAway,
                  left   : target.left + arrowOffset,
                  right  : 'auto'
                };
              break;
              case 'top center':
                positioning = {
                  bottom : parentHeight - target.top + distanceAway,
                  left   : target.left + (targetWidth / 2) - (popupWidth / 2) + arrowOffset,
                  top    : 'auto',
                  right  : 'auto'
                };
              break;
              case 'top right':
                positioning = {
                  bottom :  parentHeight - target.top + distanceAway,
                  right  :  parentWidth - target.left - targetWidth - arrowOffset,
                  top    : 'auto',
                  left   : 'auto'
                };
              break;
              case 'left center':
                positioning = {
                  top    : target.top + (targetHeight / 2) - (popupHeight / 2) + arrowOffset,
                  right  : parentWidth - target.left + distanceAway,
                  left   : 'auto',
                  bottom : 'auto'
                };
              break;
              case 'right center':
                positioning = {
                  top    : target.top + (targetHeight / 2) - (popupHeight / 2) + arrowOffset,
                  left   : target.left + targetWidth + distanceAway,
                  bottom : 'auto',
                  right  : 'auto'
                };
              break;
              case 'bottom left':
                positioning = {
                  top    : target.top + targetHeight + distanceAway,
                  left   : target.left + arrowOffset,
                  bottom : 'auto',
                  right  : 'auto'
                };
              break;
              case 'bottom center':
                positioning = {
                  top    : target.top + targetHeight + distanceAway,
                  left   : target.left + (targetWidth / 2) - (popupWidth / 2) + arrowOffset,
                  bottom : 'auto',
                  right  : 'auto'
                };
              break;
              case 'bottom right':
                positioning = {
                  top    : target.top + targetHeight + distanceAway,
                  right  : parentWidth - target.left  - targetWidth - arrowOffset,
                  left   : 'auto',
                  bottom : 'auto'
                };
              break;
            }
            if(positioning === undefined) {
              module.error(error.invalidPosition, position);
            }

            module.debug('Calculated popup positioning values', positioning);

            // tentatively place on stage
            $popup
              .css(positioning)
              .removeClass(className.position)
              .addClass(position)
              .addClass(className.loading)
            ;
            // check if is offstage
            offstagePosition = module.get.offstagePosition(position);

            // recursively find new positioning
            if(offstagePosition) {
              module.debug('Popup cant fit into viewport', offstagePosition);
              if(searchDepth < settings.maxSearchDepth) {
                searchDepth++;
                position = module.get.nextPosition(position);
                module.debug('Trying new position', position);
                return ($popup)
                  ? module.set.position(position)
                  : false
                ;
              }
              else if(!settings.lastResort) {
                module.debug('Popup could not find a position in view', $popup);
                module.error(error.cannotPlace);
                module.remove.attempts();
                module.remove.loading();
                module.reset();
                return false;
              }
            }

            module.debug('Position is on stage', position);
            module.remove.attempts();
            module.set.fluidWidth();
            module.remove.loading();
            return true;
          },

          fluidWidth: function() {
            if( settings.setFluidWidth && $popup.hasClass(className.fluid) ) {
              $popup.css('width', $offsetParent.width());
            }
          },

          visible: function() {
            $module.addClass(className.visible);
          }
        },

        remove: {
          loading: function() {
            $popup.removeClass(className.loading);
          },
          visible: function() {
            $module.removeClass(className.visible);
          },
          attempts: function() {
            module.verbose('Resetting all searched positions');
            searchDepth    = 0;
            triedPositions = false;
          }
        },

        bind: {
          popup: function() {
            module.verbose('Allowing hover events on popup to prevent closing');
            if( $popup && module.has.popup() ) {
              $popup
                .on('mouseenter' + eventNamespace, module.event.start)
                .on('mouseleave' + eventNamespace, module.event.end)
              ;
            }
          },
          close:function() {
            if(settings.hideOnScroll === true || settings.hideOnScroll == 'auto' && settings.on != 'click') {
              $document
                .one('touchmove' + eventNamespace, module.hideGracefully)
                .one('scroll' + eventNamespace, module.hideGracefully)
              ;
              $context
                .one('touchmove' + eventNamespace, module.hideGracefully)
                .one('scroll' + eventNamespace, module.hideGracefully)
              ;
            }
            if(settings.on == 'click' && settings.closable) {
              module.verbose('Binding popup close event to document');
              $document
                .on('click' + eventNamespace, function(event) {
                  module.verbose('Pop-up clickaway intent detected');
                  module.hideGracefully.call(element, event);
                })
              ;
            }
          }
        },

        unbind: {
          close: function() {
            if(settings.hideOnScroll === true || settings.hideOnScroll == 'auto' && settings.on != 'click') {
              $document
                .off('scroll' + eventNamespace, module.hide)
              ;
              $context
                .off('scroll' + eventNamespace, module.hide)
              ;
            }
            if(settings.on == 'click' && settings.closable) {
              module.verbose('Removing close event from document');
              $document
                .off('click' + eventNamespace)
              ;
            }
          }
        },

        has: {
          popup: function() {
            return ($popup && $popup.length > 0);
          }
        },

        is: {
          active: function() {
            return $module.hasClass(className.active);
          },
          animating: function() {
            return ( $popup && $popup.is(':animated') || $popup.hasClass(className.animating) );
          },
          visible: function() {
            return $popup && $popup.is(':visible');
          },
          dropdown: function() {
            return $module.hasClass(className.dropdown);
          },
          hidden: function() {
            return !module.is.visible();
          },
          rtl: function () {
            return $module.css('direction') == 'rtl';
          }
        },

        reset: function() {
          module.remove.visible();
          if(settings.preserve) {
            if($.fn.transition !== undefined) {
              $popup
                .transition('remove transition')
              ;
            }
          }
          else {
            module.removePopup();
          }
        },

        setting: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          module.destroy();
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.popup.settings = {

  name         : 'Popup',

  debug        : false,
  verbose      : true,
  performance  : true,
  namespace    : 'popup',

  onCreate     : function(){},
  onRemove     : function(){},

  onShow       : function(){},
  onVisible    : function(){},
  onHide       : function(){},
  onHidden     : function(){},

  variation    : '',
  content      : false,
  html         : false,
  title        : false,

  on           : 'hover',
  closable     : true,
  hideOnScroll : 'auto',

  context      : 'body',

  position     : 'top left',
  prefer       : 'opposite',
  lastResort   : false,

  delay        : {
    show : 30,
    hide : 0
  },

  setFluidWidth  : true,
  movePopup      : true,

  target         : false,
  popup          : false,
  inline         : false,
  preserve       : false,
  hoverable      : false,

  duration       : 200,
  easing         : 'easeOutQuint',
  transition     : 'scale',

  distanceAway   : 0,
  offset         : 0,
  maxSearchDepth : 20,

  error: {
    invalidPosition : 'The position you specified is not a valid position',
    cannotPlace     : 'No visible position could be found for the popup',
    method          : 'The method you called is not defined.'
  },

  metadata: {
    content   : 'content',
    html      : 'html',
    offset    : 'offset',
    position  : 'position',
    title     : 'title',
    variation : 'variation'
  },

  className   : {
    active    : 'active',
    animating : 'animating',
    dropdown  : 'dropdown',
    fluid     : 'fluid',
    loading   : 'loading',
    popup     : 'ui popup',
    position  : 'top left center bottom right',
    visible   : 'visible'
  },

  selector    : {
    popup    : '.ui.popup'
  },

  templates: {
    escape: function(string) {
      var
        badChars     = /[&<>"'`]/g,
        shouldEscape = /[&<>"'`]/,
        escape       = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
          "`": "&#x60;"
        },
        escapedChar  = function(chr) {
          return escape[chr];
        }
      ;
      if(shouldEscape.test(string)) {
        return string.replace(badChars, escapedChar);
      }
      return string;
    },
    popup: function(text) {
      var
        html   = '',
        escape = $.fn.popup.settings.templates.escape
      ;
      if(typeof text !== undefined) {
        if(typeof text.title !== undefined && text.title) {
          text.title = escape(text.title);
          html += '<div class="header">' + text.title + '</div>';
        }
        if(typeof text.content !== undefined && text.content) {
          text.content = escape(text.content);
          html += '<div class="content">' + text.content + '</div>';
        }
      }
      return html;
    }
  }

};

// Adds easing
$.extend( $.easing, {
  easeOutQuad: function (x, t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  }
});


})( jQuery, window , document );

/*
 * # Semantic - Rating
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributor
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

"use strict";

$.fn.rating = function(parameters) {
  var
    $allModules     = $(this),
    moduleSelector  = $allModules.selector || '',

    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),
    returnedValue
  ;
  $allModules
    .each(function() {
      var
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.rating.settings, parameters)
          : $.extend({}, $.fn.rating.settings),

        namespace       = settings.namespace,
        className       = settings.className,
        metadata        = settings.metadata,
        selector        = settings.selector,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        element         = this,
        instance        = $(this).data(moduleNamespace),

        $module         = $(this),
        $icon           = $module.find(selector.icon),

        module
      ;

      module = {

        initialize: function() {
          module.verbose('Initializing rating module', settings);

          if($icon.length === 0) {
            module.setup.layout();
          }

          if(settings.interactive) {
            module.enable();
          }
          else {
            module.disable();
          }
          if(settings.initialRating) {
            module.debug('Setting initial rating');
            module.setRating(settings.initialRating);
          }
          if( $module.data(metadata.rating) ) {
            module.debug('Rating found in metadata');
            module.setRating( $module.data(metadata.rating) );
          }
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Instantiating module', settings);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous instance', instance);
          $module
            .removeData(moduleNamespace)
          ;
          $icon
            .off(eventNamespace)
          ;
        },

        refresh: function() {
          $icon   = $module.find(selector.icon);
        },

        setup: {
          layout: function() {
            var
              maxRating = $module.data(metadata.maxRating) || settings.maxRating
            ;
            module.debug('Generating icon html dynamically');
            $module
              .html($.fn.rating.settings.templates.icon(maxRating))
            ;
            module.refresh();
          }
        },

        event: {
          mouseenter: function() {
            var
              $activeIcon = $(this)
            ;
            $activeIcon
              .nextAll()
                .removeClass(className.selected)
            ;
            $module
              .addClass(className.selected)
            ;
            $activeIcon
              .addClass(className.selected)
                .prevAll()
                .addClass(className.selected)
            ;
          },
          mouseleave: function() {
            $module
              .removeClass(className.selected)
            ;
            $icon
              .removeClass(className.selected)
            ;
          },
          click: function() {
            var
              $activeIcon   = $(this),
              currentRating = module.getRating(),
              rating        = $icon.index($activeIcon) + 1,
              canClear      = (settings.clearable == 'auto')
               ? ($icon.length === 1)
               : settings.clearable
            ;
            if(canClear && currentRating == rating) {
              module.clearRating();
            }
            else {
              module.setRating( rating );
            }
          }
        },

        clearRating: function() {
          module.debug('Clearing current rating');
          module.setRating(0);
        },

        getRating: function() {
          var
            currentRating = $icon.filter('.' + className.active).length
          ;
          module.verbose('Current rating retrieved', currentRating);
          return currentRating;
        },

        enable: function() {
          module.debug('Setting rating to interactive mode');
          $icon
            .on('mouseenter' + eventNamespace, module.event.mouseenter)
            .on('mouseleave' + eventNamespace, module.event.mouseleave)
            .on('click' + eventNamespace, module.event.click)
          ;
          $module
            .removeClass(className.disabled)
          ;
        },

        disable: function() {
          module.debug('Setting rating to read-only mode');
          $icon
            .off(eventNamespace)
          ;
          $module
            .addClass(className.disabled)
          ;
        },

        setRating: function(rating) {
          var
            ratingIndex = (rating - 1 >= 0)
              ? (rating - 1)
              : 0,
            $activeIcon = $icon.eq(ratingIndex)
          ;
          $module
            .removeClass(className.selected)
          ;
          $icon
            .removeClass(className.selected)
            .removeClass(className.active)
          ;
          if(rating > 0) {
            module.verbose('Setting current rating to', rating);
            $activeIcon
              .prevAll()
              .andSelf()
                .addClass(className.active)
            ;
          }
          settings.onRate.call(element, rating);
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };
      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          module.destroy();
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.rating.settings = {

  name          : 'Rating',
  namespace     : 'rating',

  debug         : false,
  verbose       : true,
  performance   : true,

  initialRating : 0,
  interactive   : true,
  maxRating     : 4,
  clearable     : 'auto',

  onRate        : function(rating){},

  error         : {
    method    : 'The method you called is not defined',
    noMaximum : 'No maximum rating specified. Cannot generate HTML automatically'
  },


  metadata: {
    rating    : 'rating',
    maxRating : 'maxRating'
  },

  className : {
    active   : 'active',
    disabled : 'disabled',
    selected : 'selected',
    loading  : 'loading'
  },

  selector  : {
    icon : '.icon'
  },

  templates: {
    icon: function(maxRating) {
      var
        icon = 1,
        html = ''
      ;
      while(icon <= maxRating) {
        html += '<i class="icon"></i>';
        icon++;
      }
      return html;
    }
  }

};

})( jQuery, window , document );

/*
 * # Semantic - Sidebar
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributor
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.sidebar = function(parameters) {
  var
    $allModules     = $(this),
    $window         = $(window),
    $document       = $(document),
    $html           = $('html'),
    $head           = $('head'),

    moduleSelector  = $allModules.selector || '',

    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),

    requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(callback) { setTimeout(callback, 0); },

    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.sidebar.settings, parameters)
          : $.extend({}, $.fn.sidebar.settings),

        selector        = settings.selector,
        className       = settings.className,
        namespace       = settings.namespace,
        regExp          = settings.regExp,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $module         = $(this),
        $context        = $(settings.context),

        $sidebars       = $module.children(selector.sidebar),
        $fixed          = $context.children(selector.fixed),
        $pusher         = $context.children(selector.pusher),
        $style,

        element         = this,
        instance        = $module.data(moduleNamespace),

        elementNamespace,
        id,
        currentScroll,
        transitionEvent,

        module
      ;

      module      = {

        initialize: function() {
          module.debug('Initializing sidebar', parameters);

          module.create.id();

          transitionEvent = module.get.transitionEvent();

          // cache on initialize
          if( ( settings.useLegacy == 'auto' && module.is.legacy() ) || settings.useLegacy === true) {
            settings.transition = 'overlay';
            settings.useLegacy = true;
          }

          if(module.is.ios()) {
            module.set.ios();
          }

          // avoids locking rendering if initialized in onReady
          if(settings.delaySetup) {
            requestAnimationFrame(module.setup.layout);
          }
          else {
            module.setup.layout();
          }

          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        create: {
          id: function() {
            module.verbose('Creating unique id for element');
            id = module.get.uniqueID();
            elementNamespace = '.' + id;
          }
        },

        destroy: function() {
          module.verbose('Destroying previous module for', $module);
          module.remove.direction();
          $module
            .off(eventNamespace)
            .removeData(moduleNamespace)
          ;
          // bound by uuid
          $context.off(elementNamespace);
          $window.off(elementNamespace);
          $document.off(elementNamespace);
        },

        event: {
          clickaway: function(event) {
            var
              clickedInPusher = ($pusher.find(event.target).length > 0 || $pusher.is(event.target)),
              clickedContext  = ($context.is(event.target))
            ;
            if(clickedInPusher) {
              module.verbose('User clicked on dimmed page');
              module.hide();
            }
            if(clickedContext) {
              module.verbose('User clicked on dimmable context (scaled out page)');
              module.hide();
            }
          },
          touch: function(event) {
            //event.stopPropagation();
          },
          containScroll: function(event) {
            if(element.scrollTop <= 0)  {
              element.scrollTop = 1;
            }
            if((element.scrollTop + element.offsetHeight) >= element.scrollHeight) {
              element.scrollTop = element.scrollHeight - element.offsetHeight - 1;
            }
          },
          scroll: function(event) {
            if( $(event.target).closest(selector.sidebar).length === 0 ) {
              event.preventDefault();
            }
          }
        },

        bind: {
          clickaway: function() {
            module.verbose('Adding clickaway events to context', $context);
            if(settings.closable) {
              $context
                .on('click' + elementNamespace, module.event.clickaway)
                .on('touchend' + elementNamespace, module.event.clickaway)
              ;
            }
          },
          scrollLock: function() {
            if(settings.scrollLock) {
              module.debug('Disabling page scroll');
              $window
                .on('DOMMouseScroll' + elementNamespace, module.event.scroll)
              ;
            }
            module.verbose('Adding events to contain sidebar scroll');
            $document
              .on('touchmove' + elementNamespace, module.event.touch)
            ;
            $module
              .on('scroll' + eventNamespace, module.event.containScroll)
            ;
          }
        },
        unbind: {
          clickaway: function() {
            module.verbose('Removing clickaway events from context', $context);
            $context.off(elementNamespace);
          },
          scrollLock: function() {
            module.verbose('Removing scroll lock from page');
            $document.off(elementNamespace);
            $window.off(elementNamespace);
            $module.off('scroll' + eventNamespace);
          }
        },

        add: {
          bodyCSS: function() {
            var
              width     = $module.outerWidth(),
              height    = $module.outerHeight(),
              direction = module.get.direction(),
              distance  = {
                left   : width,
                right  : -width,
                top    : height,
                bottom : -height
              },
              style
            ;
            if( module.is.rtl() ){
              module.verbose('RTL detected, flipping widths');
              distance.left = -width;
              distance.right = width;
            }

            style  = '<style title="' + namespace + '">';

            if(direction === 'left' || direction === 'right') {
              module.debug('Adding CSS rules for animation distance', width);
              style  += ''
                + ' .ui.visible.' + direction + '.sidebar ~ .fixed,'
                + ' .ui.visible.' + direction + '.sidebar ~ .pusher {'
                + '   -webkit-transform: translate3d('+ distance[direction] + 'px, 0, 0);'
                + '           transform: translate3d('+ distance[direction] + 'px, 0, 0);'
                + ' }'
              ;
            }
            else if(direction === 'top' || direction == 'bottom') {
              style  += ''
                + ' .ui.visible.' + direction + '.sidebar ~ .fixed,'
                + ' .ui.visible.' + direction + '.sidebar ~ .pusher {'
                + '   -webkit-transform: translate3d(0, ' + distance[direction] + 'px, 0);'
                + '           transform: translate3d(0, ' + distance[direction] + 'px, 0);'
                + ' }'
              ;
            }

            /* IE is only browser not to create context with transforms */
            /* https://www.w3.org/Bugs/Public/show_bug.cgi?id=16328 */
            if( module.is.ie() ) {
              if(direction === 'left' || direction === 'right') {
                module.debug('Adding CSS rules for animation distance', width);
                style  += ''
                  + ' .ui.visible.' + direction + '.sidebar ~ .pusher:after {'
                  + '   -webkit-transform: translate3d('+ distance[direction] + 'px, 0, 0);'
                  + '           transform: translate3d('+ distance[direction] + 'px, 0, 0);'
                  + ' }'
                ;
              }
              else if(direction === 'top' || direction == 'bottom') {
                style  += ''
                  + ' .ui.visible.' + direction + '.sidebar ~ .pusher:after {'
                  + '   -webkit-transform: translate3d(0, ' + distance[direction] + 'px, 0);'
                  + '           transform: translate3d(0, ' + distance[direction] + 'px, 0);'
                  + ' }'
                ;
              }
              /* opposite sides visible forces content overlay */
              style += ''
                + ' .ui.visible.left.sidebar ~ .ui.visible.right.sidebar ~ .pusher:after,'
                + ' .ui.visible.right.sidebar ~ .ui.visible.left.sidebar ~ .pusher:after {'
                + '   -webkit-transform: translate3d(0px, 0, 0);'
                + '           transform: translate3d(0px, 0, 0);'
                + ' }'
              ;
            }
            style += '</style>';
            $head.append(style);
            $style = $('style[title=' + namespace + ']');
            module.debug('Adding sizing css to head', $style);
          }
        },

        refresh: function() {
          module.verbose('Refreshing selector cache');
          $context  = $(settings.context);
          $sidebars = $context.children(selector.sidebar);
          $pusher   = $context.children(selector.pusher);
          $fixed    = $context.children(selector.fixed);
        },

        refreshSidebars: function() {
          module.verbose('Refreshing other sidebars');
          $sidebars = $context.children(selector.sidebar);
        },

        repaint: function() {
          module.verbose('Forcing repaint event');
          element.style.display='none';
          element.offsetHeight;
          element.scrollTop = element.scrollTop;
          element.style.display='';
        },

        setup: {
          layout: function() {
            if( $context.children(selector.pusher).length === 0 ) {
              module.debug('Adding wrapper element for sidebar');
              module.error(error.pusher);
              $pusher = $('<div class="pusher" />');
              $context
                .children()
                  .not(selector.omitted)
                  .not($sidebars)
                  .wrapAll($pusher)
              ;
              module.refresh();
            }
            if($module.nextAll(selector.pusher).length === 0 || $module.nextAll(selector.pusher)[0] !== $pusher[0]) {
              module.debug('Moved sidebar to correct parent element');
              module.error(error.movedSidebar, element);
              $module.detach().prependTo($context);
              module.refresh();
            }
            module.set.pushable();
            module.set.direction();
          }
        },

        attachEvents: function(selector, event) {
          var
            $toggle = $(selector)
          ;
          event = $.isFunction(module[event])
            ? module[event]
            : module.toggle
          ;
          if($toggle.length > 0) {
            module.debug('Attaching sidebar events to element', selector, event);
            $toggle
              .on('click' + eventNamespace, event)
            ;
          }
          else {
            module.error(error.notFound, selector);
          }
        },

        show: function(callback) {
          var
            animateMethod = (settings.useLegacy === true)
              ? module.legacyPushPage
              : module.pushPage
          ;
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if(module.is.hidden()) {
            module.refreshSidebars();
            if(settings.overlay)  {
              module.error(error.overlay);
              settings.transition = 'overlay';
            }
            module.refresh();
            if(module.othersActive() && module.get.transition() !== 'overlay') {
              module.debug('Other sidebars currently visible');
              settings.transition = 'overlay';
              if(settings.exclusive) {
                module.hideOthers();
              }
            }
            animateMethod(function() {
              callback.call(element);
              settings.onShow.call(element);
            });
            settings.onChange.call(element);
            settings.onVisible.call(element);
          }
          else {
            module.debug('Sidebar is already visible');
          }
        },

        hide: function(callback) {
          var
            animateMethod = (settings.useLegacy === true)
              ? module.legacyPullPage
              : module.pullPage
          ;
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if(module.is.visible() || module.is.animating()) {
            module.debug('Hiding sidebar', callback);
            module.refreshSidebars();
            animateMethod(function() {
              callback.call(element);
              settings.onHidden.call(element);
            });
            settings.onChange.call(element);
            settings.onHide.call(element);
          }
        },

        othersAnimating: function() {
          return ($sidebars.not($module).filter('.' + className.animating).length > 0);
        },
        othersVisible: function() {
          return ($sidebars.not($module).filter('.' + className.visible).length > 0);
        },
        othersActive: function() {
          return(module.othersVisible() || module.othersAnimating());
        },

        hideOthers: function(callback) {
          var
            $otherSidebars = $sidebars.not($module).filter('.' + className.visible),
            sidebarCount   = $otherSidebars.length,
            callbackCount  = 0
          ;
          callback       = callback || function(){};

          $otherSidebars
            .sidebar('hide', function() {
              callbackCount++;
              if(callbackCount == sidebarCount) {
                callback();
              }
            })
          ;
        },

        toggle: function() {
          module.verbose('Determining toggled direction');
          if(module.is.hidden()) {
            module.show();
          }
          else {
            module.hide();
          }
        },

        pushPage: function(callback) {
          var
            transition = module.get.transition(),
            $transition = (transition == 'safe')
              ? $context
              : (transition === 'overlay' || module.othersActive())
                ? $module
                : $pusher,
            animate,
            transitionEnd
          ;
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if(settings.transition == 'scale down') {
            module.scrollToTop();
          }
          module.set.transition(transition);
          module.repaint();
          animate = function() {
            module.bind.clickaway();
            module.add.bodyCSS();
            module.set.animating();
            module.set.visible();
            if(!module.othersVisible()) {
              if(settings.dimPage) {
                $pusher.addClass(className.dimmed);
              }
            }
          };
          transitionEnd = function(event) {
            if( event.target == $transition[0] ) {
              $transition.off(transitionEvent + elementNamespace, transitionEnd);
              module.remove.animating();
              module.bind.scrollLock();
              callback.call(element);
            }
          };
          $transition.off(transitionEvent + elementNamespace);
          $transition.on(transitionEvent + elementNamespace, transitionEnd);
          requestAnimationFrame(animate);
        },

        pullPage: function(callback) {
          var
            transition = module.get.transition(),
            $transition = (transition == 'safe')
              ? $context
              : (transition == 'overlay' || module.othersActive())
                ? $module
                : $pusher,
            animate,
            transitionEnd
          ;
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.verbose('Removing context push state', module.get.direction());

          module.set.transition(transition);
          module.unbind.clickaway();
          module.unbind.scrollLock();

          animate = function() {
            module.set.animating();
            module.remove.visible();
            if(settings.dimPage && !module.othersVisible()) {
              $pusher.removeClass(className.dimmed);
            }
          };
          transitionEnd = function(event) {
            if( event.target == $transition[0] ) {
              $transition.off(transitionEvent + elementNamespace, transitionEnd);
              module.remove.animating();
              module.remove.transition();
              module.remove.bodyCSS();
              if(transition == 'scale down' || (settings.returnScroll && module.is.mobile()) ) {
                module.scrollBack();
              }
              callback.call(element);
            }
          };
          $transition.off(transitionEvent + elementNamespace);
          $transition.on(transitionEvent + elementNamespace, transitionEnd);
          requestAnimationFrame(animate);
        },

        legacyPushPage: function(callback) {
          var
            distance   = $module.width(),
            direction  = module.get.direction(),
            properties = {}
          ;
          distance  = distance || $module.width();
          callback  = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          properties[direction] = distance;
          module.debug('Using javascript to push context', properties);
          module.set.visible();
          module.set.transition();
          module.set.animating();
          if(settings.dimPage) {
            $pusher.addClass(className.dimmed);
          }
          $context
            .css('position', 'relative')
            .animate(properties, settings.duration, settings.easing, function() {
              module.remove.animating();
              module.bind.clickaway();
              callback.call(element);
            })
          ;
        },
        legacyPullPage: function(callback) {
          var
            distance   = 0,
            direction  = module.get.direction(),
            properties = {}
          ;
          distance  = distance || $module.width();
          callback  = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          properties[direction] = '0px';
          module.debug('Using javascript to pull context', properties);
          module.unbind.clickaway();
          module.set.animating();
          module.remove.visible();
          if(settings.dimPage && !module.othersActive()) {
            $pusher.removeClass(className.dimmed);
          }
          $context
            .css('position', 'relative')
            .animate(properties, settings.duration, settings.easing, function() {
              module.remove.animating();
              callback.call(element);
            })
          ;
        },

        scrollToTop: function() {
          module.verbose('Scrolling to top of page to avoid animation issues');
          currentScroll = $(window).scrollTop();
          $module.scrollTop(0);
          window.scrollTo(0, 0);
        },

        scrollBack: function() {
          module.verbose('Scrolling back to original page position');
          window.scrollTo(0, currentScroll);
        },

        set: {
          // html
          ios: function() {
            $html.addClass(className.ios);
          },

          // container
          pushed: function() {
            $context.addClass(className.pushed);
          },
          pushable: function() {
            $context.addClass(className.pushable);
          },

          // sidebar
          active: function() {
            $module.addClass(className.active);
          },
          animating: function() {
            $module.addClass(className.animating);
          },
          transition: function(transition) {
            transition = transition || module.get.transition();
            $module.addClass(transition);
          },
          direction: function(direction) {
            direction = direction || module.get.direction();
            $module.addClass(className[direction]);
          },
          visible: function() {
            $module.addClass(className.visible);
          },
          overlay: function() {
            $module.addClass(className.overlay);
          }
        },
        remove: {

          bodyCSS: function() {
            module.debug('Removing body css styles', $style);
            if($style && $style.length > 0) {
              $style.remove();
            }
          },

          // context
          pushed: function() {
            $context.removeClass(className.pushed);
          },
          pushable: function() {
            $context.removeClass(className.pushable);
          },

          // sidebar
          active: function() {
            $module.removeClass(className.active);
          },
          animating: function() {
            $module.removeClass(className.animating);
          },
          transition: function(transition) {
            transition = transition || module.get.transition();
            $module.removeClass(transition);
          },
          direction: function(direction) {
            direction = direction || module.get.direction();
            $module.removeClass(className[direction]);
          },
          visible: function() {
            $module.removeClass(className.visible);
          },
          overlay: function() {
            $module.removeClass(className.overlay);
          }
        },

        get: {
          direction: function() {
            if($module.hasClass(className.top)) {
              return className.top;
            }
            else if($module.hasClass(className.right)) {
              return className.right;
            }
            else if($module.hasClass(className.bottom)) {
              return className.bottom;
            }
            return className.left;
          },
          transition: function() {
            var
              direction = module.get.direction(),
              transition
            ;
            transition = ( module.is.mobile() )
              ? (settings.mobileTransition == 'auto')
                ? settings.defaultTransition.mobile[direction]
                : settings.mobileTransition
              : (settings.transition == 'auto')
                ? settings.defaultTransition.computer[direction]
                : settings.transition
            ;
            module.verbose('Determined transition', transition);
            return transition;
          },
          transitionEvent: function() {
            var
              element     = document.createElement('element'),
              transitions = {
                'transition'       :'transitionend',
                'OTransition'      :'oTransitionEnd',
                'MozTransition'    :'transitionend',
                'WebkitTransition' :'webkitTransitionEnd'
              },
              transition
            ;
            for(transition in transitions){
              if( element.style[transition] !== undefined ){
                return transitions[transition];
              }
            }
          },
          uniqueID: function() {
            return (Math.random().toString(16) + '000000000').substr(2,8);
          }
        },

        is: {

          ie: function() {
            var
              isIE11 = (!(window.ActiveXObject) && 'ActiveXObject' in window),
              isIE   = ('ActiveXObject' in window)
            ;
            return (isIE11 || isIE);
          },

          legacy: function() {
            var
              element    = document.createElement('div'),
              transforms = {
                'webkitTransform' :'-webkit-transform',
                'OTransform'      :'-o-transform',
                'msTransform'     :'-ms-transform',
                'MozTransform'    :'-moz-transform',
                'transform'       :'transform'
              },
              has3D
            ;

            // Add it to the body to get the computed style.
            document.body.insertBefore(element, null);
            for (var transform in transforms) {
              if (element.style[transform] !== undefined) {
                element.style[transform] = "translate3d(1px,1px,1px)";
                has3D = window.getComputedStyle(element).getPropertyValue(transforms[transform]);
              }
            }
            document.body.removeChild(element);
            return !(has3D !== undefined && has3D.length > 0 && has3D !== 'none');
          },
          ios: function() {
            var
              userAgent = navigator.userAgent,
              isIOS     = userAgent.match(regExp.ios)
            ;
            if(isIOS) {
              module.verbose('Browser was found to be iOS', userAgent);
              return true;
            }
            else {
              return false;
            }
          },
          mobile: function() {
            var
              userAgent    = navigator.userAgent,
              isMobile     = userAgent.match(regExp.mobile)
            ;
            if(isMobile) {
              module.verbose('Browser was found to be mobile', userAgent);
              return true;
            }
            else {
              module.verbose('Browser is not mobile, using regular transition', userAgent);
              return false;
            }
          },
          hidden: function() {
            return !module.is.visible();
          },
          visible: function() {
            return $module.hasClass(className.visible);
          },
          // alias
          open: function() {
            return module.is.visible();
          },
          closed: function() {
            return module.is.hidden();
          },
          vertical: function() {
            return $module.hasClass(className.top);
          },
          animating: function() {
            return $context.hasClass(className.animating);
          },
          rtl: function () {
            return $module.css('direction') == 'rtl';
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      }
    ;

    if(methodInvoked) {
      if(instance === undefined) {
        module.initialize();
      }
      module.invoke(query);
    }
    else {
      if(instance !== undefined) {
        module.invoke('destroy');
      }
      module.initialize();
    }
  });

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.sidebar.settings = {

  name              : 'Sidebar',
  namespace         : 'sidebar',

  debug             : false,
  verbose           : true,
  performance       : true,

  transition        : 'auto',
  mobileTransition  : 'auto',

  defaultTransition : {
    computer: {
      left   : 'uncover',
      right  : 'uncover',
      top    : 'overlay',
      bottom : 'overlay'
    },
    mobile: {
      left   : 'uncover',
      right  : 'uncover',
      top    : 'overlay',
      bottom : 'overlay'
    }
  },

  context           : 'body',
  exclusive         : false,
  closable          : true,
  dimPage           : true,
  scrollLock        : false,
  returnScroll      : false,
  delaySetup        : false,

  useLegacy         : 'auto',
  duration          : 500,
  easing            : 'easeInOutQuint',

  onChange          : function(){},
  onShow            : function(){},
  onHide            : function(){},

  onHidden          : function(){},
  onVisible         : function(){},

  className         : {
    active    : 'active',
    animating : 'animating',
    dimmed    : 'dimmed',
    ios       : 'ios',
    pushable  : 'pushable',
    pushed    : 'pushed',
    right     : 'right',
    top       : 'top',
    left      : 'left',
    bottom    : 'bottom',
    visible   : 'visible'
  },

  selector: {
    fixed   : '.fixed',
    omitted : 'script, link, style, .ui.modal, .ui.dimmer, .ui.nag, .ui.fixed',
    pusher  : '.pusher',
    sidebar : '.ui.sidebar'
  },

  regExp: {
    ios    : /(iPad|iPhone|iPod)/g,
    mobile : /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/g
  },

  error   : {
    method       : 'The method you called is not defined.',
    pusher       : 'Had to add pusher element. For optimal performance make sure body content is inside a pusher element',
    movedSidebar : 'Had to move sidebar. For optimal performance make sure sidebar and pusher are direct children of your body tag',
    overlay      : 'The overlay setting is no longer supported, use animation: overlay',
    notFound     : 'There were no elements that matched the specified selector'
  }

};

// Adds easing
$.extend( $.easing, {
  easeInOutQuint: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  }
});


})( jQuery, window , document );

 /*
 * # Semantic - Sticky
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.sticky = function(parameters) {
  var
    $allModules    = $(this),
    moduleSelector = $allModules.selector || '',

    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),
    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings              = $.extend(true, {}, $.fn.sticky.settings, parameters),

        className             = settings.className,
        namespace             = settings.namespace,
        error                 = settings.error,

        eventNamespace        = '.' + namespace,
        moduleNamespace       = 'module-' + namespace,

        $module               = $(this),
        $window               = $(window),
        $container            = $module.offsetParent(),
        $scroll               = $(settings.scrollContext),
        $context,

        selector              = $module.selector || '',
        instance              = $module.data(moduleNamespace),

        requestAnimationFrame = window.requestAnimationFrame
          || window.mozRequestAnimationFrame
          || window.webkitRequestAnimationFrame
          || window.msRequestAnimationFrame
          || function(callback) { setTimeout(callback, 0); },

        element         = this,
        observer,
        module
      ;

      module      = {

        initialize: function() {
          if(settings.context) {
            $context = $(settings.context);
          }
          else {
            $context = $container;
          }
          if($context.length === 0) {
            module.error(error.invalidContext, settings.context, $module);
            return;
          }
          module.verbose('Initializing sticky', settings, $container);
          module.save.positions();

          // error conditions
          if( module.is.hidden() ) {
            module.error(error.visible, $module);
          }
          if(module.cache.element.height > module.cache.context.height) {
            module.reset();
            module.error(error.elementSize, $module);
            return;
          }

          $window
            .on('resize' + eventNamespace, module.event.resize)
          ;
          $scroll
            .on('scroll' + eventNamespace, module.event.scroll)
          ;

          module.observeChanges();
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module');
          module.reset();
          if(observer) {
            observer.disconnect();
          }
          $window
            .off('resize' + eventNamespace, module.event.resize)
          ;
          $scroll
            .off('scroll' + eventNamespace, module.event.scroll)
          ;
          $module
            .removeData(moduleNamespace)
          ;
        },

        observeChanges: function() {
          var
            context = $context[0]
          ;
          if(settings.observeChanges) {
            if('MutationObserver' in window) {
              observer = new MutationObserver(function(mutations) {
                clearTimeout(module.timer);
                module.timer = setTimeout(function() {
                  module.verbose('DOM tree modified, updating sticky menu');
                  module.refresh();
                }, 200);
              });
              observer.observe(element, {
                childList : true,
                subtree   : true
              });
              observer.observe(context, {
                childList : true,
                subtree   : true
              });
              module.debug('Setting up mutation observer', observer);
            }
          }
        },

        event: {
          resize: function() {
            requestAnimationFrame(function() {
              module.refresh();
              module.stick();
            });
          },
          scroll: function() {
            requestAnimationFrame(function() {
              module.stick();
              settings.onScroll.call(element);
            });
          }
        },

        refresh: function(hardRefresh) {
          module.reset();
          if(hardRefresh) {
            $container = $module.offsetParent();
          }
          module.save.positions();
          module.stick();
          settings.onReposition.call(element);
        },

        supports: {
          sticky: function() {
            var
              $element = $('<div/>'),
              element = $element.get()
            ;
            $element
              .addClass(className.supported)
            ;
            return($element.css('position').match('sticky'));
          }
        },

        save: {
          scroll: function(scroll) {
            module.lastScroll = scroll;
          },
          positions: function() {
            var
              window = {
                height: $window.height()
              },
              element = {
                margin: {
                  top    : parseInt($module.css('margin-top'), 10),
                  bottom : parseInt($module.css('margin-bottom'), 10),
                },
                offset : $module.offset(),
                width  : $module.outerWidth(),
                height : $module.outerHeight()
              },
              context = {
                offset: $context.offset(),
                height: $context.outerHeight()
              }
            ;
            module.cache = {
              fits : ( element.height < window.height ),
              window: {
                height: window.height
              },
              element: {
                margin : element.margin,
                top    : element.offset.top - element.margin.top,
                left   : element.offset.left,
                width  : element.width,
                height : element.height,
                bottom : element.offset.top + element.height
              },
              context: {
                top    : context.offset.top,
                height : context.height,
                bottom : context.offset.top + context.height
              }
            };
            module.set.containerSize();
            module.set.size();
            module.stick();
            module.debug('Caching element positions', module.cache);
          }
        },

        get: {
          direction: function(scroll) {
            var
              direction = 'down'
            ;
            scroll = scroll || $scroll.scrollTop();
            if(module.lastScroll !== undefined) {
              if(module.lastScroll < scroll) {
                direction = 'down';
              }
              else if(module.lastScroll > scroll) {
                direction = 'up';
              }
            }
            return direction;
          },
          scrollChange: function(scroll) {
            scroll = scroll || $scroll.scrollTop();
            return (module.lastScroll)
              ? (scroll - module.lastScroll)
              : 0
            ;
          },
          currentElementScroll: function() {
            return ( module.is.top() )
              ? Math.abs(parseInt($module.css('top'), 10))    || 0
              : Math.abs(parseInt($module.css('bottom'), 10)) || 0
            ;
          },
          elementScroll: function(scroll) {
            scroll = scroll || $scroll.scrollTop();
            var
              element        = module.cache.element,
              window         = module.cache.window,
              delta          = module.get.scrollChange(scroll),
              maxScroll      = (element.height - window.height + settings.offset),
              currentScroll  = module.get.currentElementScroll(),
              possibleScroll = (currentScroll + delta),
              elementScroll
            ;
            if(module.cache.fits || possibleScroll < 0) {
              elementScroll = 0;
            }
            else if (possibleScroll > maxScroll ) {
              elementScroll = maxScroll;
            }
            else {
              elementScroll = possibleScroll;
            }
            return elementScroll;
          }
        },

        remove: {
          offset: function() {
            $module.css('margin-top', '');
          }
        },

        set: {
          offset: function() {
            module.verbose('Setting offset on element', settings.offset);
            $module.css('margin-top', settings.offset);
          },
          containerSize: function() {
            var
              tagName = $container.get(0).tagName
            ;
            if(tagName === 'HTML' || tagName == 'body') {
              // this can trigger for too many reasons
              //module.error(error.container, tagName, $module);
              $container = $module.offsetParent();
            }
            else {
              module.debug('Settings container size', module.cache.context.height);
              $container.height(module.cache.context.height);
            }
          },
          scroll: function(scroll) {
            module.debug('Setting scroll on element', scroll);
            if( module.is.top() ) {
              $module
                .css('bottom', '')
                .css('top', -scroll)
              ;
            }
            if( module.is.bottom() ) {
              $module
                .css('top', '')
                .css('bottom', scroll)
              ;
            }
          },
          size: function() {
            if(module.cache.element.height !== 0 && module.cache.element.width !== 0) {
              $module
                .css({
                  width  : module.cache.element.width,
                  height : module.cache.element.height
                })
              ;
            }
          }
        },

        is: {
          top: function() {
            return $module.hasClass(className.top);
          },
          bottom: function() {
            return $module.hasClass(className.bottom);
          },
          initialPosition: function() {
            return (!module.is.fixed() && !module.is.bound());
          },
          hidden: function() {
            return (!$module.is(':visible'));
          },
          bound: function() {
            return $module.hasClass(className.bound);
          },
          fixed: function() {
            return $module.hasClass(className.fixed);
          }
        },

        stick: function() {
          var
            cache          = module.cache,
            fits           = cache.fits,
            element        = cache.element,
            window         = cache.window,
            context        = cache.context,
            offset         = (module.is.bottom() && settings.pushing)
              ? settings.bottomOffset
              : settings.offset,
            scroll         = {
              top    : $scroll.scrollTop() + offset,
              bottom : $scroll.scrollTop() + offset + window.height
            },
            direction      = module.get.direction(scroll.top),
            elementScroll  = module.get.elementScroll(scroll.top),

            // shorthand
            doesntFit      = !fits,
            elementVisible = (element.height !== 0)
          ;

          // save current scroll for next run
          module.save.scroll(scroll.top);

          if(elementVisible) {

            if( module.is.initialPosition() ) {
              if(scroll.top >= element.top) {
                module.debug('Element passed, fixing element to page');
                module.fixTop();
              }
            }
            else if( module.is.fixed() ) {

              // currently fixed top
              if( module.is.top() ) {
                if( scroll.top < element.top ) {
                  module.debug('Fixed element reached top of container');
                  module.setInitialPosition();
                }
                else if( (element.height + scroll.top - elementScroll) > context.bottom ) {
                  module.debug('Fixed element reached bottom of container');
                  module.bindBottom();
                }
                // scroll element if larger than screen
                else if(doesntFit) {
                  module.set.scroll(elementScroll);
                }
              }

              // currently fixed bottom
              else if(module.is.bottom() ) {

                // top edge
                if( (scroll.bottom - element.height) < element.top) {
                  module.debug('Bottom fixed rail has reached top of container');
                  module.setInitialPosition();
                }
                // bottom edge
                else if(scroll.bottom > context.bottom) {
                  module.debug('Bottom fixed rail has reached bottom of container');
                  module.bindBottom();
                }
                // scroll element if larger than screen
                else if(doesntFit) {
                  module.set.scroll(elementScroll);
                }

              }
            }
            else if( module.is.bottom() ) {
              if(settings.pushing) {
                if(module.is.bound() && scroll.bottom < context.bottom ) {
                  module.debug('Fixing bottom attached element to bottom of browser.');
                  module.fixBottom();
                }
              }
              else {
                if(module.is.bound() && (scroll.top < context.bottom - element.height) ) {
                  module.debug('Fixing bottom attached element to top of browser.');
                  module.fixTop();
                }
              }
            }
          }
        },

        bindTop: function() {
          module.debug('Binding element to top of parent container');
          module.remove.offset();
          $module
            .css('left' , '')
            .css('top' , '')
            .css('bottom' , '')
            .removeClass(className.fixed)
            .removeClass(className.bottom)
            .addClass(className.bound)
            .addClass(className.top)
          ;
          settings.onTop.call(element);
          settings.onUnstick.call(element);
        },
        bindBottom: function() {
          module.debug('Binding element to bottom of parent container');
          module.remove.offset();
          $module
            .css('left' , '')
            .css('top' , '')
            .css('bottom' , '')
            .removeClass(className.fixed)
            .removeClass(className.top)
            .addClass(className.bound)
            .addClass(className.bottom)
          ;
          settings.onBottom.call(element);
          settings.onUnstick.call(element);
        },

        setInitialPosition: function() {
          module.unfix();
          module.unbind();
        },


        fixTop: function() {
          module.debug('Fixing element to top of page');
          module.set.offset();
          $module
            .css('left', module.cache.element.left)
            .removeClass(className.bound)
            .removeClass(className.bottom)
            .addClass(className.fixed)
            .addClass(className.top)
          ;
          settings.onStick.call(element);
        },

        fixBottom: function() {
          module.debug('Sticking element to bottom of page');
          module.set.offset();
          $module
            .css('left', module.cache.element.left)
            .removeClass(className.bound)
            .removeClass(className.top)
            .addClass(className.fixed)
            .addClass(className.bottom)
          ;
          settings.onStick.call(element);
        },

        unbind: function() {
          module.debug('Removing absolute position on element');
          module.remove.offset();
          $module
            .removeClass(className.bound)
            .removeClass(className.top)
            .removeClass(className.bottom)
          ;
        },

        unfix: function() {
          module.debug('Removing fixed position on element');
          module.remove.offset();
          $module
            .removeClass(className.fixed)
            .removeClass(className.top)
            .removeClass(className.bottom)
          ;
          settings.onUnstick.call(element);
        },

        reset: function() {
          module.debug('Reseting elements position');
          module.unbind();
          module.unfix();
          module.resetCSS();
        },

        resetCSS: function() {
          $module
            .css({
              top    : '',
              bottom : '',
              width  : '',
              height : ''
            })
          ;
          $container
            .css({
              height: ''
            })
          ;
        },

        setting: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 0);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          module.destroy();
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.sticky.settings = {

  name           : 'Sticky',
  namespace      : 'sticky',

  debug          : false,
  verbose        : false,
  performance    : false,

  pushing        : false,
  context        : false,
  scrollContext  : window,
  offset         : 0,
  bottomOffset   : 0,

  observeChanges : true,

  onReposition   : function(){},
  onScroll       : function(){},
  onStick        : function(){},
  onUnstick      : function(){},
  onTop          : function(){},
  onBottom       : function(){},

  error         : {
    container      : 'Sticky element must be inside a relative container',
    visible        : 'Element is hidden, you must call refresh after element becomes visible',
    method         : 'The method you called is not defined.',
    invalidContext : 'Context specified does not exist',
    elementSize    : 'Sticky element is larger than its container, cannot create sticky.'
  },

  className : {
    bound     : 'bound',
    fixed     : 'fixed',
    supported : 'native',
    top       : 'top',
    bottom    : 'bottom'
  }

};

})( jQuery, window , document );

 /*
 * # Semantic - Tab
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

"use strict";

$.fn.tab = function(parameters) {

  var
    // use window context if none specified
    $allModules     = $.isFunction(this)
        ? $(window)
        : $(this),

    settings        = ( $.isPlainObject(parameters) )
      ? $.extend(true, {}, $.fn.tab.settings, parameters)
      : $.extend({}, $.fn.tab.settings),

    moduleSelector  = $allModules.selector || '',
    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),

    module,
    returnedValue
  ;

  $allModules
    .each(function() {
      var

        className          = settings.className,
        metadata           = settings.metadata,
        selector           = settings.selector,
        error              = settings.error,

        eventNamespace     = '.' + settings.namespace,
        moduleNamespace    = 'module-' + settings.namespace,

        $module            = $(this),

        cache              = {},
        firstLoad          = true,
        recursionDepth     = 0,

        $context,
        $tabs,
        activeTabPath,
        parameterArray,
        historyEvent,

        element         = this,
        instance        = $module.data(moduleNamespace)
      ;

      module = {

        initialize: function() {
          module.debug('Initializing tab menu item', $module);

          module.determineTabs();
          module.debug('Determining tabs', settings.context, $tabs);

          // set up automatic routing
          if(settings.auto) {
            module.verbose('Setting up automatic tab retrieval from server');
            settings.apiSettings = {
              url: settings.path + '/{$tab}'
            };
          }

          // attach events if navigation wasn't set to window
          if( !$.isWindow( element ) ) {
            module.debug('Attaching tab activation events to element', $module);
            $module
              .on('click' + eventNamespace, module.event.click)
            ;
          }
          module.instantiate();
        },

        determineTabs: function() {
          var
            $reference
          ;

          // determine tab context
          if(settings.context === 'parent') {
            if($module.closest(selector.ui).length > 0) {
              $reference = $module.closest(selector.ui);
              module.verbose('Using closest UI element for determining parent', $reference);
            }
            else {
              $reference = $module;
            }
            $context = $reference.parent();
            module.verbose('Determined parent element for creating context', $context);
          }
          else if(settings.context) {
            $context = $(settings.context);
            module.verbose('Using selector for tab context', settings.context, $context);
          }
          else {
            $context = $('body');
          }

          // find tabs
          if(settings.childrenOnly) {
            $tabs = $context.children(selector.tabs);
            module.debug('Searching tab context children for tabs', $context, $tabs);
          }
          else {
            $tabs = $context.find(selector.tabs);
            module.debug('Searching tab context for tabs', $context, $tabs);
          }
        },

        initializeHistory: function() {
          if(settings.history) {
            module.debug('Initializing page state');
            if( $.address === undefined ) {
              module.error(error.state);
              return false;
            }
            else {
              if(settings.historyType == 'state') {
                module.debug('Using HTML5 to manage state');
                if(settings.path !== false) {
                  $.address
                    .history(true)
                    .state(settings.path)
                  ;
                }
                else {
                  module.error(error.path);
                  return false;
                }
              }
              $.address
                .bind('change', module.event.history.change)
              ;
            }
          }
        },

        instantiate: function () {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.debug('Destroying tabs', $module);
          $module
            .removeData(moduleNamespace)
            .off(eventNamespace)
          ;
        },

        event: {
          click: function(event) {
            var
              tabPath = $(this).data(metadata.tab)
            ;
            if(tabPath !== undefined) {
              if(settings.history) {
                module.verbose('Updating page state', event);
                $.address.value(tabPath);
              }
              else {
                module.verbose('Changing tab', event);
                module.changeTab(tabPath);
              }
              event.preventDefault();
            }
            else {
              module.debug('No tab specified');
            }
          },
          history: {
            change: function(event) {
              var
                tabPath   = event.pathNames.join('/') || module.get.initialPath(),
                pageTitle = settings.templates.determineTitle(tabPath) || false
              ;
              module.performance.display();
              module.debug('History change event', tabPath, event);
              historyEvent = event;
              if(tabPath !== undefined) {
                module.changeTab(tabPath);
              }
              if(pageTitle) {
                $.address.title(pageTitle);
              }
            }
          }
        },

        refresh: function() {
          if(activeTabPath) {
            module.debug('Refreshing tab', activeTabPath);
            module.changeTab(activeTabPath);
          }
        },

        cache: {

          read: function(cacheKey) {
            return (cacheKey !== undefined)
              ? cache[cacheKey]
              : false
            ;
          },
          add: function(cacheKey, content) {
            cacheKey = cacheKey || activeTabPath;
            module.debug('Adding cached content for', cacheKey);
            cache[cacheKey] = content;
          },
          remove: function(cacheKey) {
            cacheKey = cacheKey || activeTabPath;
            module.debug('Removing cached content for', cacheKey);
            delete cache[cacheKey];
          }
        },

        set: {
          state: function(state) {
            $.address.value(state);
          }
        },

        changeTab: function(tabPath) {
          var
            pushStateAvailable = (window.history && window.history.pushState),
            shouldIgnoreLoad   = (pushStateAvailable && settings.ignoreFirstLoad && firstLoad),
            remoteContent      = (settings.auto || $.isPlainObject(settings.apiSettings) ),
            // only get default path if not remote content
            pathArray = (remoteContent && !shouldIgnoreLoad)
              ? module.utilities.pathToArray(tabPath)
              : module.get.defaultPathArray(tabPath)
          ;
          tabPath = module.utilities.arrayToPath(pathArray);
          $.each(pathArray, function(index, tab) {
            var
              currentPathArray   = pathArray.slice(0, index + 1),
              currentPath        = module.utilities.arrayToPath(currentPathArray),

              isTab              = module.is.tab(currentPath),
              isLastIndex        = (index + 1 == pathArray.length),

              $tab               = module.get.tabElement(currentPath),
              $anchor,
              nextPathArray,
              nextPath,
              isLastTab
            ;
            module.verbose('Looking for tab', tab);
            if(isTab) {
              module.verbose('Tab was found', tab);

              // scope up
              activeTabPath = currentPath;
              parameterArray = module.utilities.filterArray(pathArray, currentPathArray);

              if(isLastIndex) {
                isLastTab = true;
              }
              else {
                nextPathArray = pathArray.slice(0, index + 2);
                nextPath      = module.utilities.arrayToPath(nextPathArray);
                isLastTab     = ( !module.is.tab(nextPath) );
                if(isLastTab) {
                  module.verbose('Tab parameters found', nextPathArray);
                }
              }
              if(isLastTab && remoteContent) {
                if(!shouldIgnoreLoad) {
                  module.activate.navigation(currentPath);
                  module.content.fetch(currentPath, tabPath);
                }
                else {
                  module.debug('Ignoring remote content on first tab load', currentPath);
                  firstLoad = false;
                  module.cache.add(tabPath, $tab.html());
                  module.activate.all(currentPath);
                  settings.onTabInit.call($tab, currentPath, parameterArray, historyEvent);
                  settings.onTabLoad.call($tab, currentPath, parameterArray, historyEvent);
                }
                return false;
              }
              else {
                module.debug('Opened local tab', currentPath);
                module.activate.all(currentPath);
                if( !module.cache.read(currentPath) ) {
                  module.cache.add(currentPath, true);
                  module.debug('First time tab loaded calling tab init');
                  settings.onTabInit.call($tab, currentPath, parameterArray, historyEvent);
                }
                settings.onTabLoad.call($tab, currentPath, parameterArray, historyEvent);
              }
            }
            else if(tabPath.search('/') == -1 && tabPath !== '') {
              // look for in page anchor
              $anchor     = $('#' + tabPath + ', a[name="' + tabPath + '"]'),
              currentPath = $anchor.closest('[data-tab]').data('tab');
              $tab        = module.get.tabElement(currentPath);
              // if anchor exists use parent tab
              if($anchor && $anchor.length > 0 && currentPath) {
                module.debug('No tab found, but deep anchor link present, opening parent tab');
                module.activate.all(currentPath);
                if( !module.cache.read(currentPath) ) {
                  module.cache.add(currentPath, true);
                  module.debug('First time tab loaded calling tab init');
                  settings.onTabInit.call($tab, currentPath, parameterArray, historyEvent);
                }
                return false;
              }
            }
            else {
              module.error(error.missingTab, $module, $context, currentPath);
              return false;
            }
          });
        },

        content: {

          fetch: function(tabPath, fullTabPath) {
            var
              $tab             = module.get.tabElement(tabPath),
              apiSettings      = {
                dataType     : 'html',
                stateContext : $tab,
                onSuccess      : function(response) {
                  module.cache.add(fullTabPath, response);
                  module.content.update(tabPath, response);
                  if(tabPath == activeTabPath) {
                    module.debug('Content loaded', tabPath);
                    module.activate.tab(tabPath);
                  }
                  else {
                    module.debug('Content loaded in background', tabPath);
                  }
                  settings.onTabInit.call($tab, tabPath, parameterArray, historyEvent);
                  settings.onTabLoad.call($tab, tabPath, parameterArray, historyEvent);
                },
                urlData: { tab: fullTabPath }
              },
              request         = $tab.data(metadata.promise) || false,
              existingRequest = ( request && request.state() === 'pending' ),
              requestSettings,
              cachedContent
            ;

            fullTabPath   = fullTabPath || tabPath;
            cachedContent = module.cache.read(fullTabPath);

            if(settings.cache && cachedContent) {
              module.debug('Showing existing content', fullTabPath);
              module.content.update(tabPath, cachedContent);
              module.activate.tab(tabPath);
              settings.onTabLoad.call($tab, tabPath, parameterArray, historyEvent);
            }
            else if(existingRequest) {
              module.debug('Content is already loading', fullTabPath);
              $tab
                .addClass(className.loading)
              ;
            }
            else if($.api !== undefined) {
              requestSettings = $.extend(true, { headers: { 'X-Remote': true } }, settings.apiSettings, apiSettings);
              module.debug('Retrieving remote content', fullTabPath, requestSettings);
              $.api( requestSettings );
            }
            else {
              module.error(error.api);
            }
          },

          update: function(tabPath, html) {
            module.debug('Updating html for', tabPath);
            var
              $tab = module.get.tabElement(tabPath)
            ;
            $tab
              .html(html)
            ;
          }
        },

        activate: {
          all: function(tabPath) {
            module.activate.tab(tabPath);
            module.activate.navigation(tabPath);
          },
          tab: function(tabPath) {
            var
              $tab = module.get.tabElement(tabPath)
            ;
            module.verbose('Showing tab content for', $tab);
            $tab
              .addClass(className.active)
              .siblings($tabs)
                .removeClass(className.active + ' ' + className.loading)
            ;
          },
          navigation: function(tabPath) {
            var
              $navigation = module.get.navElement(tabPath)
            ;
            module.verbose('Activating tab navigation for', $navigation, tabPath);
            $navigation
              .addClass(className.active)
              .siblings($allModules)
                .removeClass(className.active + ' ' + className.loading)
            ;
          }
        },

        deactivate: {
          all: function() {
            module.deactivate.navigation();
            module.deactivate.tabs();
          },
          navigation: function() {
            $allModules
              .removeClass(className.active)
            ;
          },
          tabs: function() {
            $tabs
              .removeClass(className.active + ' ' + className.loading)
            ;
          }
        },

        is: {
          tab: function(tabName) {
            return (tabName !== undefined)
              ? ( module.get.tabElement(tabName).length > 0 )
              : false
            ;
          }
        },

        get: {
          initialPath: function() {
            return $allModules.eq(0).data(metadata.tab) || $tabs.eq(0).data(metadata.tab);
          },
          path: function() {
            return $.address.value();
          },
          // adds default tabs to tab path
          defaultPathArray: function(tabPath) {
            return module.utilities.pathToArray( module.get.defaultPath(tabPath) );
          },
          defaultPath: function(tabPath) {
            var
              $defaultNav = $allModules.filter('[data-' + metadata.tab + '^="' + tabPath + '/"]').eq(0),
              defaultTab  = $defaultNav.data(metadata.tab) || false
            ;
            if( defaultTab ) {
              module.debug('Found default tab', defaultTab);
              if(recursionDepth < settings.maxDepth) {
                recursionDepth++;
                return module.get.defaultPath(defaultTab);
              }
              module.error(error.recursion);
            }
            else {
              module.debug('No default tabs found for', tabPath, $tabs);
            }
            recursionDepth = 0;
            return tabPath;
          },
          navElement: function(tabPath) {
            tabPath = tabPath || activeTabPath;
            return $allModules.filter('[data-' + metadata.tab + '="' + tabPath + '"]');
          },
          tabElement: function(tabPath) {
            var
              $fullPathTab,
              $simplePathTab,
              tabPathArray,
              lastTab
            ;
            tabPath        = tabPath || activeTabPath;
            tabPathArray   = module.utilities.pathToArray(tabPath);
            lastTab        = module.utilities.last(tabPathArray);
            $fullPathTab   = $tabs.filter('[data-' + metadata.tab + '="' + lastTab + '"]');
            $simplePathTab = $tabs.filter('[data-' + metadata.tab + '="' + tabPath + '"]');
            return ($fullPathTab.length > 0)
              ? $fullPathTab
              : $simplePathTab
            ;
          },
          tab: function() {
            return activeTabPath;
          }
        },

        utilities: {
          filterArray: function(keepArray, removeArray) {
            return $.grep(keepArray, function(keepValue) {
              return ( $.inArray(keepValue, removeArray) == -1);
            });
          },
          last: function(array) {
            return $.isArray(array)
              ? array[ array.length - 1]
              : false
            ;
          },
          pathToArray: function(pathName) {
            if(pathName === undefined) {
              pathName = activeTabPath;
            }
            return typeof pathName == 'string'
              ? pathName.split('/')
              : [pathName]
            ;
          },
          arrayToPath: function(pathArray) {
            return $.isArray(pathArray)
              ? pathArray.join('/')
              : false
            ;
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };
      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          module.destroy();
        }
        module.initialize();
      }
    })
  ;
  if(module && !methodInvoked) {
    module.initializeHistory();
  }
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;

};

// shortcut for tabbed content with no defined navigation
$.tab = function() {
  $(window).tab.apply(this, arguments);
};

$.fn.tab.settings = {

  name            : 'Tab',
  namespace       : 'tab',

  debug           : false,
  verbose         : true,
  performance     : true,

  auto            : false,  // uses pjax style endpoints fetching content from same url with remote-content headers
  history         : false,  // use browser history
  historyType     : 'hash', // #/ or html5 state
  path            : false,  // base path of url

  context         : false,  // specify a context that tabs must appear inside
  childrenOnly    : false,  // use only tabs that are children of context
  maxDepth        : 25,     // max depth a tab can be nested

  alwaysRefresh   : false,  // load tab content new every tab click
  cache           : true,   // cache the content requests to pull locally
  ignoreFirstLoad : false,  // don't load remote content on first load
  apiSettings     : false,  // settings for api call

  onTabInit    : function(tabPath, parameterArray, historyEvent) {}, // called first time loaded
  onTabLoad    : function(tabPath, parameterArray, historyEvent) {}, // called on every load

  templates    : {
    determineTitle: function(tabArray) {} // returns page title for path
  },

  error: {
    api        : 'You attempted to load content without API module',
    method     : 'The method you called is not defined',
    missingTab : 'Activated tab cannot be found for this context.',
    noContent  : 'The tab you specified is missing a content url.',
    path       : 'History enabled, but no path was specified',
    recursion  : 'Max recursive depth reached',
    state      : 'History requires Asual\'s Address library <https://github.com/asual/jquery-address>'
  },

  metadata : {
    tab    : 'tab',
    loaded : 'loaded',
    promise: 'promise'
  },

  className   : {
    loading : 'loading',
    active  : 'active'
  },

  selector    : {
    tabs : '.ui.tab',
    ui   : '.ui'
  }

};

})( jQuery, window , document );
/*
 * # Semantic - Transition
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributor
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.transition = function() {
  var
    $allModules     = $(this),
    moduleSelector  = $allModules.selector || '',

    time            = new Date().getTime(),
    performance     = [],

    moduleArguments = arguments,
    query           = moduleArguments[0],
    queryArguments  = [].slice.call(arguments, 1),
    methodInvoked   = (typeof query === 'string'),

    requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(callback) { setTimeout(callback, 0); },

    returnedValue
  ;
  $allModules
    .each(function() {
      var
        $module  = $(this),
        element  = this,

        // set at run time
        settings,
        instance,

        error,
        className,
        metadata,
        animationStart,
        animationEnd,
        animationName,

        namespace,
        moduleNamespace,
        eventNamespace,
        module
      ;

      module = {

        initialize: function() {

          // get full settings
          moduleNamespace = 'module-' + namespace;
          settings        = module.get.settings.apply(element, moduleArguments);
          className       = settings.className;
          metadata        = settings.metadata;

          animationStart  = module.get.animationStartEvent();
          animationEnd    = module.get.animationEndEvent();
          animationName   = module.get.animationName();
          error           = settings.error;
          namespace       = settings.namespace;
          eventNamespace  = '.' + settings.namespace;
          instance        = $module.data(moduleNamespace) || module;

          if(methodInvoked) {
            methodInvoked = module.invoke(query);
          }
          // no internal method was found matching query or query not made
          if(methodInvoked === false) {
            module.verbose('Converted arguments into settings object', settings);
            module.animate();
            module.instantiate();
          }
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          $module
            .data(moduleNamespace, instance)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module for', element);
          $module
            .removeData(moduleNamespace)
          ;
        },

        refresh: function() {
          module.verbose('Refreshing display type on next animation');
          delete module.displayType;
        },

        forceRepaint: function() {
          module.verbose('Forcing element repaint');
          var
            $parentElement = $module.parent(),
            $nextElement = $module.next()
          ;
          if($nextElement.length === 0) {
            $module.detach().appendTo($parentElement);
          }
          else {
            $module.detach().insertBefore($nextElement);
          }
        },

        repaint: function() {
          module.verbose('Repainting element');
          var
            fakeAssignment = element.offsetWidth
          ;
        },

        animate: function(overrideSettings) {
          settings = overrideSettings || settings;
          if(!module.is.supported()) {
            module.error(error.support);
            return false;
          }
          module.debug('Preparing animation', settings.animation);
          if(module.is.animating()) {
            if(settings.queue) {
              if(!settings.allowRepeats && module.has.direction() && module.is.occurring() && module.queuing !== true) {
                module.debug('Animation is currently occurring, preventing queueing same animation', settings.animation);
              }
              else {
                module.queue(settings.animation);
              }
              return false;
            }
            else if(!settings.allowRepeats && module.is.occurring()) {
              module.debug('Animation is already occurring, will not execute repeated animation', settings.animation);
              return false;
            }
          }
          if( module.can.animate() ) {
            module.set.animating(settings.animation);
          }
          else {
            module.error(error.noAnimation, settings.animation, element);
          }
        },

        reset: function() {
          module.debug('Resetting animation to beginning conditions');
          module.remove.animationEndCallback();
          module.restore.conditions();
          module.remove.animating();
        },

        queue: function(animation) {
          module.debug('Queueing animation of', animation);
          module.queuing = true;
          $module
            .one(animationEnd + eventNamespace, function() {
              module.queuing = false;
              module.repaint();
              module.animate.apply(this, settings);
            })
          ;
        },

        complete: function () {
          module.verbose('CSS animation complete', settings.animation);
          module.remove.animationEndCallback();
          module.remove.failSafe();
          if(!module.is.looping()) {
            if( module.is.outward() ) {
              module.verbose('Animation is outward, hiding element');
              module.restore.conditions();
              module.hide();
              settings.onHide.call(this);
            }
            else if( module.is.inward() ) {
              module.verbose('Animation is outward, showing element');
              module.restore.conditions();
              module.show();
              module.set.display();
              settings.onShow.call(this);
            }
            else {
              module.restore.conditions();
            }
            module.remove.animation();
            module.remove.animating();
          }
          settings.onComplete.call(this);
        },

        has: {
          direction: function(animation) {
            var
              hasDirection = false
            ;
            animation = animation || settings.animation;
            if(typeof animation === 'string') {
              animation = animation.split(' ');
              $.each(animation, function(index, word){
                if(word === className.inward || word === className.outward) {
                  hasDirection = true;
                }
              });
            }
            return hasDirection;
          },
          inlineDisplay: function() {
            var
              style = $module.attr('style') || ''
            ;
            return $.isArray(style.match(/display.*?;/, ''));
          }
        },

        set: {
          animating: function(animation) {
            animation = animation || settings.animation;
            if(!module.is.animating()) {
              module.save.conditions();
            }
            module.remove.direction();
            module.remove.animationEndCallback();
            if(module.can.transition() && !module.has.direction()) {
              module.set.direction();
            }
            module.remove.hidden();
            module.set.display();
            $module
              .addClass(className.animating + ' ' + className.transition + ' ' + animation)
              .addClass(animation)
              .one(animationEnd + '.complete' + eventNamespace, module.complete)
            ;
            if(settings.useFailSafe) {
              module.add.failSafe();
            }
            module.set.duration(settings.duration);
            settings.onStart.call(this);
            module.debug('Starting tween', animation, $module.attr('class'));
          },
          duration: function(animationName, duration) {
            duration = duration || settings.duration;
            duration = (typeof duration == 'number')
              ? duration + 'ms'
              : duration
            ;
            module.verbose('Setting animation duration', duration);
            if(duration || duration === 0) {
              $module
                .css({
                  '-webkit-animation-duration': duration,
                  '-moz-animation-duration': duration,
                  '-ms-animation-duration': duration,
                  '-o-animation-duration': duration,
                  'animation-duration':  duration
                })
              ;
            }
          },
          display: function() {
            var
              style              = module.get.style(),
              displayType        = module.get.displayType(),
              overrideStyle      = style + 'display: ' + displayType + ' !important;'
            ;
            $module.css('display', '');
            module.refresh();
            if( $module.css('display') !== displayType ) {
              module.verbose('Setting inline visibility to', displayType);
              $module
                .attr('style', overrideStyle)
              ;
            }
          },
          direction: function() {
            if($module.is(':visible') && !module.is.hidden()) {
              module.debug('Automatically determining the direction of animation', 'Outward');
              $module
                .removeClass(className.inward)
                .addClass(className.outward)
              ;
            }
            else {
              module.debug('Automatically determining the direction of animation', 'Inward');
              $module
                .removeClass(className.outward)
                .addClass(className.inward)
              ;
            }
          },
          looping: function() {
            module.debug('Transition set to loop');
            $module
              .addClass(className.looping)
            ;
          },
          hidden: function() {
            if(!module.is.hidden()) {
              $module
                .addClass(className.transition)
                .addClass(className.hidden)
              ;
              if($module.css('display') !== 'none') {
                module.verbose('Overriding default display to hide element');
                $module
                  .css('display', 'none')
                ;
              }
            }
          },
          visible: function() {
            $module
              .addClass(className.transition)
              .addClass(className.visible)
            ;
          }
        },

        save: {
          displayType: function(displayType) {
            $module.data(metadata.displayType, displayType);
          },
          transitionExists: function(animation, exists) {
            $.fn.transition.exists[animation] = exists;
            module.verbose('Saving existence of transition', animation, exists);
          },
          conditions: function() {
            var
              clasName = $module.attr('class') || false,
              style = $module.attr('style') || ''
            ;
            $module.removeClass(settings.animation);
            module.remove.direction();
            module.cache = {
              className : $module.attr('class'),
              style     : module.get.style()
            };
            module.verbose('Saving original attributes', module.cache);
          }
        },

        restore: {
          conditions: function() {
            if(module.cache === undefined) {
              return false;
            }
            if(module.cache.className) {
              $module.attr('class', module.cache.className);
            }
            else {
              $module.removeAttr('class');
            }
            if(module.cache.style) {
              module.verbose('Restoring original style attribute', module.cache.style);
              $module.attr('style', module.cache.style);
            }
            if(module.is.looping()) {
              module.remove.looping();
            }
            module.verbose('Restoring original attributes', module.cache);
          }
        },

        add: {
          failSafe: function() {
            var
              duration = module.get.duration()
            ;
            module.timer = setTimeout(module.complete, duration + 100);
            module.verbose('Adding fail safe timer', module.timer);
          }
        },

        remove: {
          animating: function() {
            $module.removeClass(className.animating);
          },
          animation: function() {
            $module
              .css({
                '-webkit-animation' : '',
                '-moz-animation'    : '',
                '-ms-animation'     : '',
                '-o-animation'      : '',
                'animation'         : ''
              })
            ;
          },
          animationEndCallback: function() {
            $module.off('.complete');
          },
          display: function() {
            $module.css('display', '');
          },
          direction: function() {
            $module
              .removeClass(className.inward)
              .removeClass(className.outward)
            ;
          },
          failSafe: function() {
            module.verbose('Removing fail safe timer', module.timer);
            if(module.timer) {
              clearTimeout(module.timer);
            }
          },
          hidden: function() {
            $module.removeClass(className.hidden);
          },
          visible: function() {
            $module.removeClass(className.visible);
          },
          looping: function() {
            module.debug('Transitions are no longer looping');
            $module
              .removeClass(className.looping)
            ;
            module.forceRepaint();
          },
          transition: function() {
            $module
              .removeClass(className.visible)
              .removeClass(className.hidden)
            ;
          }
        },
        get: {
          settings: function(animation, duration, onComplete) {
            // single settings object
            if(typeof animation == 'object') {
              return $.extend(true, {}, $.fn.transition.settings, animation);
            }
            // all arguments provided
            else if(typeof onComplete == 'function') {
              return $.extend({}, $.fn.transition.settings, {
                animation  : animation,
                onComplete : onComplete,
                duration   : duration
              });
            }
            // only duration provided
            else if(typeof duration == 'string' || typeof duration == 'number') {
              return $.extend({}, $.fn.transition.settings, {
                animation : animation,
                duration  : duration
              });
            }
            // duration is actually settings object
            else if(typeof duration == 'object') {
              return $.extend({}, $.fn.transition.settings, duration, {
                animation : animation
              });
            }
            // duration is actually callback
            else if(typeof duration == 'function') {
              return $.extend({}, $.fn.transition.settings, {
                animation  : animation,
                onComplete : duration
              });
            }
            // only animation provided
            else {
              return $.extend({}, $.fn.transition.settings, {
                animation : animation
              });
            }
            return $.fn.transition.settings;
          },
          duration: function(duration) {
            duration = duration || settings.duration;
            if(duration === false) {
              duration = $module.css('animation-duration') || 0;
            }
            return (typeof duration === 'string')
              ? (duration.indexOf('ms') > -1)
                ? parseFloat(duration)
                : parseFloat(duration) * 1000
              : duration
            ;
          },
          displayType: function() {
            if(settings.displayType) {
              return settings.displayType;
            }
            if($module.data(metadata.displayType) === undefined) {
              // create fake element to determine display state
              module.can.transition(true);
            }
            return $module.data(metadata.displayType);
          },
          style: function() {
            var
              style = $module.attr('style') || ''
            ;
            return style.replace(/display.*?;/, '');
          },
          transitionExists: function(animation) {
            return $.fn.transition.exists[animation];
          },
          animationName: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationName',
                'OAnimation'      :'oAnimationName',
                'MozAnimation'    :'mozAnimationName',
                'WebkitAnimation' :'webkitAnimationName'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
                return animations[animation];
              }
            }
            return false;
          },
          animationStartEvent: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationstart',
                'OAnimation'      :'oAnimationStart',
                'MozAnimation'    :'mozAnimationStart',
                'WebkitAnimation' :'webkitAnimationStart'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
                return animations[animation];
              }
            }
            return false;
          },
          animationEndEvent: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationend',
                'OAnimation'      :'oAnimationEnd',
                'MozAnimation'    :'mozAnimationEnd',
                'WebkitAnimation' :'webkitAnimationEnd'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
                return animations[animation];
              }
            }
            return false;
          }

        },

        can: {
          transition: function(forced) {
            var
              elementClass      = $module.attr('class'),
              tagName           = $module.prop('tagName'),
              animation         = settings.animation,
              transitionExists  = module.get.transitionExists(animation),
              $clone,
              currentAnimation,
              inAnimation,
              directionExists,
              displayType
            ;
            if( transitionExists === undefined || forced) {
              module.verbose('Determining whether animation exists');
              $clone = $('<' + tagName + ' />').addClass( elementClass ).insertAfter($module);
              currentAnimation = $clone
                .addClass(animation)
                .removeClass(className.inward)
                .removeClass(className.outward)
                .addClass(className.animating)
                .addClass(className.transition)
                .css(animationName)
              ;
              inAnimation = $clone
                .addClass(className.inward)
                .css(animationName)
              ;
              displayType = $clone
                .attr('class', elementClass)
                .removeAttr('style')
                .removeClass(className.hidden)
                .removeClass(className.visible)
                .show()
                .css('display')
              ;
              module.verbose('Determining final display state', displayType);
              $clone.remove();
              if(currentAnimation != inAnimation) {
                module.debug('Direction exists for animation', animation);
                directionExists = true;
              }
              else if(currentAnimation == 'none' || !currentAnimation) {
                module.debug('No animation defined in css', animation);
                return;
              }
              else {
                module.debug('Static animation found', animation, displayType);
                directionExists = false;
              }
              module.save.displayType(displayType);
              module.save.transitionExists(animation, directionExists);
            }
            return (transitionExists !== undefined)
              ? transitionExists
              : directionExists
            ;
          },
          animate: function() {
            // can transition does not return a value if animation does not exist
            return (module.can.transition() !== undefined);
          }
        },

        is: {
          animating: function() {
            return $module.hasClass(className.animating);
          },
          inward: function() {
            return $module.hasClass(className.inward);
          },
          outward: function() {
            return $module.hasClass(className.outward);
          },
          looping: function() {
            return $module.hasClass(className.looping);
          },
          occurring: function(animation) {
            animation = animation || settings.animation;
            animation = '.' + animation.replace(' ', '.');
            return ( $module.filter(animation).length > 0 );
          },
          visible: function() {
            return $module.is(':visible');
          },
          hidden: function() {
            return $module.css('visibility') === 'hidden';
          },
          supported: function() {
            return(animationName !== false && animationEnd !== false);
          }
        },

        hide: function() {
          module.verbose('Hiding element');
          if( module.is.animating() ) {
            module.reset();
          }
          module.remove.display();
          module.remove.visible();
          module.set.hidden();
          module.repaint();
        },

        show: function(display) {
          module.verbose('Showing element', display);
          module.remove.hidden();
          module.set.visible();
          module.repaint();
        },

        start: function() {
          module.verbose('Starting animation');
          $module.removeClass(className.disabled);
        },

        stop: function() {
          module.debug('Stopping animation');
          $module.addClass(className.disabled);
        },

        toggle: function() {
          module.debug('Toggling play status');
          $module.toggleClass(className.disabled);
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 600);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        // modified for transition to return invoke success
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }

          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return (found !== undefined)
            ? found
            : false
          ;
        }
      };
      module.initialize();
    })
  ;
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

// Records if CSS transition is available
$.fn.transition.exists = {};

$.fn.transition.settings = {

  // module info
  name         : 'Transition',

  // debug content outputted to console
  debug        : false,

  // verbose debug output
  verbose      : true,

  // performance data output
  performance  : true,

  // event namespace
  namespace    : 'transition',

  // animation complete event
  onStart      : function() {},
  onComplete   : function() {},
  onShow       : function() {},
  onHide       : function() {},

  // whether timeout should be used to ensure callback fires in cases animationend does not
  useFailSafe  : true,

  // whether EXACT animation can occur twice in a row
  allowRepeats : false,

  // Override final display type on visible
  displayType  : false,

  // animation duration
  animation    : 'fade',
  duration     : false,

  // new animations will occur after previous ones
  queue       : true,

  metadata : {
    displayType: 'display'
  },

  className   : {
    animating  : 'animating',
    disabled   : 'disabled',
    hidden     : 'hidden',
    inward     : 'in',
    loading    : 'loading',
    looping    : 'looping',
    outward    : 'out',
    transition : 'transition',
    visible    : 'visible'
  },

  // possible errors
  error: {
    noAnimation : 'There is no css animation matching the one you specified.',
    repeated    : 'That animation is already occurring, cancelling repeated animation',
    method      : 'The method you called is not defined',
    support     : 'This browser does not support CSS animations'
  }

};


})( jQuery, window , document );

$( document ).ready(function() {
    $('.filter input:checked').parent().parent().addClass('active');

    $('.filter input').click(function(){
        $(this).parent().parent().toggleClass('active');
    });
});
/*
 * Swiper 2.7.5
 * Mobile touch slider and framework with hardware accelerated transitions
 *
 * http://www.idangero.us/sliders/swiper/
 *
 * Copyright 2010-2015, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under GPL & MIT
 *
 * Released on: January 28, 2015
*/
var Swiper=function(a,b){"use strict";function c(a,b){return document.querySelectorAll?(b||document).querySelectorAll(a):jQuery(a,b)}function d(a){return"[object Array]"===Object.prototype.toString.apply(a)?!0:!1}function e(){var a=G-J;return b.freeMode&&(a=G-J),b.slidesPerView>D.slides.length&&!b.centeredSlides&&(a=0),0>a&&(a=0),a}function f(){function a(a){var c,d,e=function(){"undefined"!=typeof D&&null!==D&&(void 0!==D.imagesLoaded&&D.imagesLoaded++,D.imagesLoaded===D.imagesToLoad.length&&(D.reInit(),b.onImagesReady&&D.fireCallback(b.onImagesReady,D)))};a.complete?e():(d=a.currentSrc||a.getAttribute("src"),d?(c=new Image,c.onload=e,c.onerror=e,c.src=d):e())}var d=D.h.addEventListener,e="wrapper"===b.eventTarget?D.wrapper:D.container;if(D.browser.ie10||D.browser.ie11?(d(e,D.touchEvents.touchStart,p),d(document,D.touchEvents.touchMove,q),d(document,D.touchEvents.touchEnd,r)):(D.support.touch&&(d(e,"touchstart",p),d(e,"touchmove",q),d(e,"touchend",r)),b.simulateTouch&&(d(e,"mousedown",p),d(document,"mousemove",q),d(document,"mouseup",r))),b.autoResize&&d(window,"resize",D.resizeFix),g(),D._wheelEvent=!1,b.mousewheelControl){if(void 0!==document.onmousewheel&&(D._wheelEvent="mousewheel"),!D._wheelEvent)try{new WheelEvent("wheel"),D._wheelEvent="wheel"}catch(f){}D._wheelEvent||(D._wheelEvent="DOMMouseScroll"),D._wheelEvent&&d(D.container,D._wheelEvent,j)}if(b.keyboardControl&&d(document,"keydown",i),b.updateOnImagesReady){D.imagesToLoad=c("img",D.container);for(var h=0;h<D.imagesToLoad.length;h++)a(D.imagesToLoad[h])}}function g(){var a,d=D.h.addEventListener;if(b.preventLinks){var e=c("a",D.container);for(a=0;a<e.length;a++)d(e[a],"click",n)}if(b.releaseFormElements){var f=c("input, textarea, select",D.container);for(a=0;a<f.length;a++)d(f[a],D.touchEvents.touchStart,o,!0),D.support.touch&&b.simulateTouch&&d(f[a],"mousedown",o,!0)}if(b.onSlideClick)for(a=0;a<D.slides.length;a++)d(D.slides[a],"click",k);if(b.onSlideTouch)for(a=0;a<D.slides.length;a++)d(D.slides[a],D.touchEvents.touchStart,l)}function h(){var a,d=D.h.removeEventListener;if(b.onSlideClick)for(a=0;a<D.slides.length;a++)d(D.slides[a],"click",k);if(b.onSlideTouch)for(a=0;a<D.slides.length;a++)d(D.slides[a],D.touchEvents.touchStart,l);if(b.releaseFormElements){var e=c("input, textarea, select",D.container);for(a=0;a<e.length;a++)d(e[a],D.touchEvents.touchStart,o,!0),D.support.touch&&b.simulateTouch&&d(e[a],"mousedown",o,!0)}if(b.preventLinks){var f=c("a",D.container);for(a=0;a<f.length;a++)d(f[a],"click",n)}}function i(a){var b=a.keyCode||a.charCode;if(!(a.shiftKey||a.altKey||a.ctrlKey||a.metaKey)){if(37===b||39===b||38===b||40===b){for(var c=!1,d=D.h.getOffset(D.container),e=D.h.windowScroll().left,f=D.h.windowScroll().top,g=D.h.windowWidth(),h=D.h.windowHeight(),i=[[d.left,d.top],[d.left+D.width,d.top],[d.left,d.top+D.height],[d.left+D.width,d.top+D.height]],j=0;j<i.length;j++){var k=i[j];k[0]>=e&&k[0]<=e+g&&k[1]>=f&&k[1]<=f+h&&(c=!0)}if(!c)return}N?((37===b||39===b)&&(a.preventDefault?a.preventDefault():a.returnValue=!1),39===b&&D.swipeNext(),37===b&&D.swipePrev()):((38===b||40===b)&&(a.preventDefault?a.preventDefault():a.returnValue=!1),40===b&&D.swipeNext(),38===b&&D.swipePrev())}}function j(a){var c=D._wheelEvent,d=0;if(a.detail)d=-a.detail;else if("mousewheel"===c)if(b.mousewheelControlForceToAxis)if(N){if(!(Math.abs(a.wheelDeltaX)>Math.abs(a.wheelDeltaY)))return;d=a.wheelDeltaX}else{if(!(Math.abs(a.wheelDeltaY)>Math.abs(a.wheelDeltaX)))return;d=a.wheelDeltaY}else d=a.wheelDelta;else if("DOMMouseScroll"===c)d=-a.detail;else if("wheel"===c)if(b.mousewheelControlForceToAxis)if(N){if(!(Math.abs(a.deltaX)>Math.abs(a.deltaY)))return;d=-a.deltaX}else{if(!(Math.abs(a.deltaY)>Math.abs(a.deltaX)))return;d=-a.deltaY}else d=Math.abs(a.deltaX)>Math.abs(a.deltaY)?-a.deltaX:-a.deltaY;if(b.freeMode){var f=D.getWrapperTranslate()+d;if(f>0&&(f=0),f<-e()&&(f=-e()),D.setWrapperTransition(0),D.setWrapperTranslate(f),D.updateActiveSlide(f),0===f||f===-e())return}else(new Date).getTime()-V>60&&(0>d?D.swipeNext():D.swipePrev()),V=(new Date).getTime();return b.autoplay&&D.stopAutoplay(!0),a.preventDefault?a.preventDefault():a.returnValue=!1,!1}function k(a){D.allowSlideClick&&(m(a),D.fireCallback(b.onSlideClick,D,a))}function l(a){m(a),D.fireCallback(b.onSlideTouch,D,a)}function m(a){if(a.currentTarget)D.clickedSlide=a.currentTarget;else{var c=a.srcElement;do{if(c.className.indexOf(b.slideClass)>-1)break;c=c.parentNode}while(c);D.clickedSlide=c}D.clickedSlideIndex=D.slides.indexOf(D.clickedSlide),D.clickedSlideLoopIndex=D.clickedSlideIndex-(D.loopedSlides||0)}function n(a){return D.allowLinks?void 0:(a.preventDefault?a.preventDefault():a.returnValue=!1,b.preventLinksPropagation&&"stopPropagation"in a&&a.stopPropagation(),!1)}function o(a){return a.stopPropagation?a.stopPropagation():a.returnValue=!1,!1}function p(a){if(b.preventLinks&&(D.allowLinks=!0),D.isTouched||b.onlyExternal)return!1;var c=a.target||a.srcElement;document.activeElement&&document.activeElement!==document.body&&document.activeElement!==c&&document.activeElement.blur();var d="input select textarea".split(" ");if(b.noSwiping&&c&&t(c))return!1;if(_=!1,D.isTouched=!0,$="touchstart"===a.type,!$&&"which"in a&&3===a.which)return D.isTouched=!1,!1;if(!$||1===a.targetTouches.length){D.callPlugins("onTouchStartBegin"),!$&&!D.isAndroid&&d.indexOf(c.tagName.toLowerCase())<0&&(a.preventDefault?a.preventDefault():a.returnValue=!1);var e=$?a.targetTouches[0].pageX:a.pageX||a.clientX,f=$?a.targetTouches[0].pageY:a.pageY||a.clientY;D.touches.startX=D.touches.currentX=e,D.touches.startY=D.touches.currentY=f,D.touches.start=D.touches.current=N?e:f,D.setWrapperTransition(0),D.positions.start=D.positions.current=D.getWrapperTranslate(),D.setWrapperTranslate(D.positions.start),D.times.start=(new Date).getTime(),I=void 0,b.moveStartThreshold>0&&(X=!1),b.onTouchStart&&D.fireCallback(b.onTouchStart,D,a),D.callPlugins("onTouchStartEnd")}}function q(a){if(D.isTouched&&!b.onlyExternal&&(!$||"mousemove"!==a.type)){var c=$?a.targetTouches[0].pageX:a.pageX||a.clientX,d=$?a.targetTouches[0].pageY:a.pageY||a.clientY;if("undefined"==typeof I&&N&&(I=!!(I||Math.abs(d-D.touches.startY)>Math.abs(c-D.touches.startX))),"undefined"!=typeof I||N||(I=!!(I||Math.abs(d-D.touches.startY)<Math.abs(c-D.touches.startX))),I)return void(D.isTouched=!1);if(N){if(!b.swipeToNext&&c<D.touches.startX||!b.swipeToPrev&&c>D.touches.startX)return}else if(!b.swipeToNext&&d<D.touches.startY||!b.swipeToPrev&&d>D.touches.startY)return;if(a.assignedToSwiper)return void(D.isTouched=!1);if(a.assignedToSwiper=!0,b.preventLinks&&(D.allowLinks=!1),b.onSlideClick&&(D.allowSlideClick=!1),b.autoplay&&D.stopAutoplay(!0),!$||1===a.touches.length){if(D.isMoved||(D.callPlugins("onTouchMoveStart"),b.loop&&(D.fixLoop(),D.positions.start=D.getWrapperTranslate()),b.onTouchMoveStart&&D.fireCallback(b.onTouchMoveStart,D)),D.isMoved=!0,a.preventDefault?a.preventDefault():a.returnValue=!1,D.touches.current=N?c:d,D.positions.current=(D.touches.current-D.touches.start)*b.touchRatio+D.positions.start,D.positions.current>0&&b.onResistanceBefore&&D.fireCallback(b.onResistanceBefore,D,D.positions.current),D.positions.current<-e()&&b.onResistanceAfter&&D.fireCallback(b.onResistanceAfter,D,Math.abs(D.positions.current+e())),b.resistance&&"100%"!==b.resistance){var f;if(D.positions.current>0&&(f=1-D.positions.current/J/2,D.positions.current=.5>f?J/2:D.positions.current*f),D.positions.current<-e()){var g=(D.touches.current-D.touches.start)*b.touchRatio+(e()+D.positions.start);f=(J+g)/J;var h=D.positions.current-g*(1-f)/2,i=-e()-J/2;D.positions.current=i>h||0>=f?i:h}}if(b.resistance&&"100%"===b.resistance&&(D.positions.current>0&&(!b.freeMode||b.freeModeFluid)&&(D.positions.current=0),D.positions.current<-e()&&(!b.freeMode||b.freeModeFluid)&&(D.positions.current=-e())),!b.followFinger)return;if(b.moveStartThreshold)if(Math.abs(D.touches.current-D.touches.start)>b.moveStartThreshold||X){if(!X)return X=!0,void(D.touches.start=D.touches.current);D.setWrapperTranslate(D.positions.current)}else D.positions.current=D.positions.start;else D.setWrapperTranslate(D.positions.current);return(b.freeMode||b.watchActiveIndex)&&D.updateActiveSlide(D.positions.current),b.grabCursor&&(D.container.style.cursor="move",D.container.style.cursor="grabbing",D.container.style.cursor="-moz-grabbin",D.container.style.cursor="-webkit-grabbing"),Y||(Y=D.touches.current),Z||(Z=(new Date).getTime()),D.velocity=(D.touches.current-Y)/((new Date).getTime()-Z)/2,Math.abs(D.touches.current-Y)<2&&(D.velocity=0),Y=D.touches.current,Z=(new Date).getTime(),D.callPlugins("onTouchMoveEnd"),b.onTouchMove&&D.fireCallback(b.onTouchMove,D,a),!1}}}function r(a){if(I&&D.swipeReset(),!b.onlyExternal&&D.isTouched){D.isTouched=!1,b.grabCursor&&(D.container.style.cursor="move",D.container.style.cursor="grab",D.container.style.cursor="-moz-grab",D.container.style.cursor="-webkit-grab"),D.positions.current||0===D.positions.current||(D.positions.current=D.positions.start),b.followFinger&&D.setWrapperTranslate(D.positions.current),D.times.end=(new Date).getTime(),D.touches.diff=D.touches.current-D.touches.start,D.touches.abs=Math.abs(D.touches.diff),D.positions.diff=D.positions.current-D.positions.start,D.positions.abs=Math.abs(D.positions.diff);var c=D.positions.diff,d=D.positions.abs,f=D.times.end-D.times.start;5>d&&300>f&&D.allowLinks===!1&&(b.freeMode||0===d||D.swipeReset(),b.preventLinks&&(D.allowLinks=!0),b.onSlideClick&&(D.allowSlideClick=!0)),setTimeout(function(){"undefined"!=typeof D&&null!==D&&(b.preventLinks&&(D.allowLinks=!0),b.onSlideClick&&(D.allowSlideClick=!0))},100);var g=e();if(!D.isMoved&&b.freeMode)return D.isMoved=!1,b.onTouchEnd&&D.fireCallback(b.onTouchEnd,D,a),void D.callPlugins("onTouchEnd");if(!D.isMoved||D.positions.current>0||D.positions.current<-g)return D.swipeReset(),b.onTouchEnd&&D.fireCallback(b.onTouchEnd,D,a),void D.callPlugins("onTouchEnd");if(D.isMoved=!1,b.freeMode){if(b.freeModeFluid){var h,i=1e3*b.momentumRatio,j=D.velocity*i,k=D.positions.current+j,l=!1,m=20*Math.abs(D.velocity)*b.momentumBounceRatio;-g>k&&(b.momentumBounce&&D.support.transitions?(-m>k+g&&(k=-g-m),h=-g,l=!0,_=!0):k=-g),k>0&&(b.momentumBounce&&D.support.transitions?(k>m&&(k=m),h=0,l=!0,_=!0):k=0),0!==D.velocity&&(i=Math.abs((k-D.positions.current)/D.velocity)),D.setWrapperTranslate(k),D.setWrapperTransition(i),b.momentumBounce&&l&&D.wrapperTransitionEnd(function(){_&&(b.onMomentumBounce&&D.fireCallback(b.onMomentumBounce,D),D.callPlugins("onMomentumBounce"),D.setWrapperTranslate(h),D.setWrapperTransition(300))}),D.updateActiveSlide(k)}return(!b.freeModeFluid||f>=300)&&D.updateActiveSlide(D.positions.current),b.onTouchEnd&&D.fireCallback(b.onTouchEnd,D,a),void D.callPlugins("onTouchEnd")}H=0>c?"toNext":"toPrev","toNext"===H&&300>=f&&(30>d||!b.shortSwipes?D.swipeReset():D.swipeNext(!0,!0)),"toPrev"===H&&300>=f&&(30>d||!b.shortSwipes?D.swipeReset():D.swipePrev(!0,!0));var n=0;if("auto"===b.slidesPerView){for(var o,p=Math.abs(D.getWrapperTranslate()),q=0,r=0;r<D.slides.length;r++)if(o=N?D.slides[r].getWidth(!0,b.roundLengths):D.slides[r].getHeight(!0,b.roundLengths),q+=o,q>p){n=o;break}n>J&&(n=J)}else n=F*b.slidesPerView;"toNext"===H&&f>300&&(d>=n*b.longSwipesRatio?D.swipeNext(!0,!0):D.swipeReset()),"toPrev"===H&&f>300&&(d>=n*b.longSwipesRatio?D.swipePrev(!0,!0):D.swipeReset()),b.onTouchEnd&&D.fireCallback(b.onTouchEnd,D,a),D.callPlugins("onTouchEnd")}}function s(a,b){return a&&a.getAttribute("class")&&a.getAttribute("class").indexOf(b)>-1}function t(a){var c=!1;do s(a,b.noSwipingClass)&&(c=!0),a=a.parentElement;while(!c&&a.parentElement&&!s(a,b.wrapperClass));return!c&&s(a,b.wrapperClass)&&s(a,b.noSwipingClass)&&(c=!0),c}function u(a,b){var c,d=document.createElement("div");return d.innerHTML=b,c=d.firstChild,c.className+=" "+a,c.outerHTML}function v(a,c,d){function e(){var f=+new Date,l=f-g;h+=i*l/(1e3/60),k="toNext"===j?h>a:a>h,k?(D.setWrapperTranslate(Math.ceil(h)),D._DOMAnimating=!0,window.setTimeout(function(){e()},1e3/60)):(b.onSlideChangeEnd&&("to"===c?d.runCallbacks===!0&&D.fireCallback(b.onSlideChangeEnd,D,j):D.fireCallback(b.onSlideChangeEnd,D,j)),D.setWrapperTranslate(a),D._DOMAnimating=!1)}var f="to"===c&&d.speed>=0?d.speed:b.speed,g=+new Date;if(D.support.transitions||!b.DOMAnimation)D.setWrapperTranslate(a),D.setWrapperTransition(f);else{var h=D.getWrapperTranslate(),i=Math.ceil((a-h)/f*(1e3/60)),j=h>a?"toNext":"toPrev",k="toNext"===j?h>a:a>h;if(D._DOMAnimating)return;e()}D.updateActiveSlide(a),b.onSlideNext&&"next"===c&&d.runCallbacks===!0&&D.fireCallback(b.onSlideNext,D,a),b.onSlidePrev&&"prev"===c&&d.runCallbacks===!0&&D.fireCallback(b.onSlidePrev,D,a),b.onSlideReset&&"reset"===c&&d.runCallbacks===!0&&D.fireCallback(b.onSlideReset,D,a),"next"!==c&&"prev"!==c&&"to"!==c||d.runCallbacks!==!0||w(c)}function w(a){if(D.callPlugins("onSlideChangeStart"),b.onSlideChangeStart)if(b.queueStartCallbacks&&D.support.transitions){if(D._queueStartCallbacks)return;D._queueStartCallbacks=!0,D.fireCallback(b.onSlideChangeStart,D,a),D.wrapperTransitionEnd(function(){D._queueStartCallbacks=!1})}else D.fireCallback(b.onSlideChangeStart,D,a);if(b.onSlideChangeEnd)if(D.support.transitions)if(b.queueEndCallbacks){if(D._queueEndCallbacks)return;D._queueEndCallbacks=!0,D.wrapperTransitionEnd(function(c){D.fireCallback(b.onSlideChangeEnd,c,a)})}else D.wrapperTransitionEnd(function(c){D.fireCallback(b.onSlideChangeEnd,c,a)});else b.DOMAnimation||setTimeout(function(){D.fireCallback(b.onSlideChangeEnd,D,a)},10)}function x(){var a=D.paginationButtons;if(a)for(var b=0;b<a.length;b++)D.h.removeEventListener(a[b],"click",z)}function y(){var a=D.paginationButtons;if(a)for(var b=0;b<a.length;b++)D.h.addEventListener(a[b],"click",z)}function z(a){for(var c,d=a.target||a.srcElement,e=D.paginationButtons,f=0;f<e.length;f++)d===e[f]&&(c=f);b.autoplay&&D.stopAutoplay(!0),D.swipeTo(c)}function A(){ab=setTimeout(function(){b.loop?(D.fixLoop(),D.swipeNext(!0,!0)):D.swipeNext(!0,!0)||(b.autoplayStopOnLast?(clearTimeout(ab),ab=void 0):D.swipeTo(0)),D.wrapperTransitionEnd(function(){"undefined"!=typeof ab&&A()})},b.autoplay)}function B(){D.calcSlides(),b.loader.slides.length>0&&0===D.slides.length&&D.loadSlides(),b.loop&&D.createLoop(),D.init(),f(),b.pagination&&D.createPagination(!0),b.loop||b.initialSlide>0?D.swipeTo(b.initialSlide,0,!1):D.updateActiveSlide(0),b.autoplay&&D.startAutoplay(),D.centerIndex=D.activeIndex,b.onSwiperCreated&&D.fireCallback(b.onSwiperCreated,D),D.callPlugins("onSwiperCreated")}if(!document.body.outerHTML&&document.body.__defineGetter__&&HTMLElement){var C=HTMLElement.prototype;C.__defineGetter__&&C.__defineGetter__("outerHTML",function(){return(new XMLSerializer).serializeToString(this)})}if(window.getComputedStyle||(window.getComputedStyle=function(a){return this.el=a,this.getPropertyValue=function(b){var c=/(\-([a-z]){1})/g;return"float"===b&&(b="styleFloat"),c.test(b)&&(b=b.replace(c,function(){return arguments[2].toUpperCase()})),a.currentStyle[b]?a.currentStyle[b]:null},this}),Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){for(var c=b||0,d=this.length;d>c;c++)if(this[c]===a)return c;return-1}),(document.querySelectorAll||window.jQuery)&&"undefined"!=typeof a&&(a.nodeType||0!==c(a).length)){var D=this;D.touches={start:0,startX:0,startY:0,current:0,currentX:0,currentY:0,diff:0,abs:0},D.positions={start:0,abs:0,diff:0,current:0},D.times={start:0,end:0},D.id=(new Date).getTime(),D.container=a.nodeType?a:c(a)[0],D.isTouched=!1,D.isMoved=!1,D.activeIndex=0,D.centerIndex=0,D.activeLoaderIndex=0,D.activeLoopIndex=0,D.previousIndex=null,D.velocity=0,D.snapGrid=[],D.slidesGrid=[],D.imagesToLoad=[],D.imagesLoaded=0,D.wrapperLeft=0,D.wrapperRight=0,D.wrapperTop=0,D.wrapperBottom=0,D.isAndroid=navigator.userAgent.toLowerCase().indexOf("android")>=0;var E,F,G,H,I,J,K={eventTarget:"wrapper",mode:"horizontal",touchRatio:1,speed:300,freeMode:!1,freeModeFluid:!1,momentumRatio:1,momentumBounce:!0,momentumBounceRatio:1,slidesPerView:1,slidesPerGroup:1,slidesPerViewFit:!0,simulateTouch:!0,followFinger:!0,shortSwipes:!0,longSwipesRatio:.5,moveStartThreshold:!1,onlyExternal:!1,createPagination:!0,pagination:!1,paginationElement:"span",paginationClickable:!1,paginationAsRange:!0,resistance:!0,scrollContainer:!1,preventLinks:!0,preventLinksPropagation:!1,noSwiping:!1,noSwipingClass:"swiper-no-swiping",initialSlide:0,keyboardControl:!1,mousewheelControl:!1,mousewheelControlForceToAxis:!1,useCSS3Transforms:!0,autoplay:!1,autoplayDisableOnInteraction:!0,autoplayStopOnLast:!1,loop:!1,loopAdditionalSlides:0,roundLengths:!1,calculateHeight:!1,cssWidthAndHeight:!1,updateOnImagesReady:!0,releaseFormElements:!0,watchActiveIndex:!1,visibilityFullFit:!1,offsetPxBefore:0,offsetPxAfter:0,offsetSlidesBefore:0,offsetSlidesAfter:0,centeredSlides:!1,queueStartCallbacks:!1,queueEndCallbacks:!1,autoResize:!0,resizeReInit:!1,DOMAnimation:!0,loader:{slides:[],slidesHTMLType:"inner",surroundGroups:1,logic:"reload",loadAllSlides:!1},swipeToPrev:!0,swipeToNext:!0,slideElement:"div",slideClass:"swiper-slide",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",wrapperClass:"swiper-wrapper",paginationElementClass:"swiper-pagination-switch",paginationActiveClass:"swiper-active-switch",paginationVisibleClass:"swiper-visible-switch"};b=b||{};for(var L in K)if(L in b&&"object"==typeof b[L])for(var M in K[L])M in b[L]||(b[L][M]=K[L][M]);else L in b||(b[L]=K[L]);D.params=b,b.scrollContainer&&(b.freeMode=!0,b.freeModeFluid=!0),b.loop&&(b.resistance="100%");var N="horizontal"===b.mode,O=["mousedown","mousemove","mouseup"];D.browser.ie10&&(O=["MSPointerDown","MSPointerMove","MSPointerUp"]),D.browser.ie11&&(O=["pointerdown","pointermove","pointerup"]),D.touchEvents={touchStart:D.support.touch||!b.simulateTouch?"touchstart":O[0],touchMove:D.support.touch||!b.simulateTouch?"touchmove":O[1],touchEnd:D.support.touch||!b.simulateTouch?"touchend":O[2]};for(var P=D.container.childNodes.length-1;P>=0;P--)if(D.container.childNodes[P].className)for(var Q=D.container.childNodes[P].className.split(/\s+/),R=0;R<Q.length;R++)Q[R]===b.wrapperClass&&(E=D.container.childNodes[P]);D.wrapper=E,D._extendSwiperSlide=function(a){return a.append=function(){return b.loop?a.insertAfter(D.slides.length-D.loopedSlides):(D.wrapper.appendChild(a),D.reInit()),a},a.prepend=function(){return b.loop?(D.wrapper.insertBefore(a,D.slides[D.loopedSlides]),D.removeLoopedSlides(),D.calcSlides(),D.createLoop()):D.wrapper.insertBefore(a,D.wrapper.firstChild),D.reInit(),a},a.insertAfter=function(c){if("undefined"==typeof c)return!1;var d;return b.loop?(d=D.slides[c+1+D.loopedSlides],d?D.wrapper.insertBefore(a,d):D.wrapper.appendChild(a),D.removeLoopedSlides(),D.calcSlides(),D.createLoop()):(d=D.slides[c+1],D.wrapper.insertBefore(a,d)),D.reInit(),a},a.clone=function(){return D._extendSwiperSlide(a.cloneNode(!0))},a.remove=function(){D.wrapper.removeChild(a),D.reInit()},a.html=function(b){return"undefined"==typeof b?a.innerHTML:(a.innerHTML=b,a)},a.index=function(){for(var b,c=D.slides.length-1;c>=0;c--)a===D.slides[c]&&(b=c);return b},a.isActive=function(){return a.index()===D.activeIndex?!0:!1},a.swiperSlideDataStorage||(a.swiperSlideDataStorage={}),a.getData=function(b){return a.swiperSlideDataStorage[b]},a.setData=function(b,c){return a.swiperSlideDataStorage[b]=c,a},a.data=function(b,c){return"undefined"==typeof c?a.getAttribute("data-"+b):(a.setAttribute("data-"+b,c),a)},a.getWidth=function(b,c){return D.h.getWidth(a,b,c)},a.getHeight=function(b,c){return D.h.getHeight(a,b,c)},a.getOffset=function(){return D.h.getOffset(a)},a},D.calcSlides=function(a){var c=D.slides?D.slides.length:!1;D.slides=[],D.displaySlides=[];for(var d=0;d<D.wrapper.childNodes.length;d++)if(D.wrapper.childNodes[d].className)for(var e=D.wrapper.childNodes[d].className,f=e.split(/\s+/),i=0;i<f.length;i++)f[i]===b.slideClass&&D.slides.push(D.wrapper.childNodes[d]);for(d=D.slides.length-1;d>=0;d--)D._extendSwiperSlide(D.slides[d]);c!==!1&&(c!==D.slides.length||a)&&(h(),g(),D.updateActiveSlide(),D.params.pagination&&D.createPagination(),D.callPlugins("numberOfSlidesChanged"))},D.createSlide=function(a,c,d){c=c||D.params.slideClass,d=d||b.slideElement;var e=document.createElement(d);return e.innerHTML=a||"",e.className=c,D._extendSwiperSlide(e)},D.appendSlide=function(a,b,c){return a?a.nodeType?D._extendSwiperSlide(a).append():D.createSlide(a,b,c).append():void 0},D.prependSlide=function(a,b,c){return a?a.nodeType?D._extendSwiperSlide(a).prepend():D.createSlide(a,b,c).prepend():void 0},D.insertSlideAfter=function(a,b,c,d){return"undefined"==typeof a?!1:b.nodeType?D._extendSwiperSlide(b).insertAfter(a):D.createSlide(b,c,d).insertAfter(a)},D.removeSlide=function(a){if(D.slides[a]){if(b.loop){if(!D.slides[a+D.loopedSlides])return!1;D.slides[a+D.loopedSlides].remove(),D.removeLoopedSlides(),D.calcSlides(),D.createLoop()}else D.slides[a].remove();return!0}return!1},D.removeLastSlide=function(){return D.slides.length>0?(b.loop?(D.slides[D.slides.length-1-D.loopedSlides].remove(),D.removeLoopedSlides(),D.calcSlides(),D.createLoop()):D.slides[D.slides.length-1].remove(),!0):!1},D.removeAllSlides=function(){for(var a=D.slides.length,b=D.slides.length-1;b>=0;b--)D.slides[b].remove(),b===a-1&&D.setWrapperTranslate(0)},D.getSlide=function(a){return D.slides[a]},D.getLastSlide=function(){return D.slides[D.slides.length-1]},D.getFirstSlide=function(){return D.slides[0]},D.activeSlide=function(){return D.slides[D.activeIndex]},D.fireCallback=function(){var a=arguments[0];if("[object Array]"===Object.prototype.toString.call(a))for(var c=0;c<a.length;c++)"function"==typeof a[c]&&a[c](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);else"[object String]"===Object.prototype.toString.call(a)?b["on"+a]&&D.fireCallback(b["on"+a],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]):a(arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},D.addCallback=function(a,b){var c,e=this;return e.params["on"+a]?d(this.params["on"+a])?this.params["on"+a].push(b):"function"==typeof this.params["on"+a]?(c=this.params["on"+a],this.params["on"+a]=[],this.params["on"+a].push(c),this.params["on"+a].push(b)):void 0:(this.params["on"+a]=[],this.params["on"+a].push(b))},D.removeCallbacks=function(a){D.params["on"+a]&&(D.params["on"+a]=null)};var S=[];for(var T in D.plugins)if(b[T]){var U=D.plugins[T](D,b[T]);U&&S.push(U)}D.callPlugins=function(a,b){b||(b={});for(var c=0;c<S.length;c++)a in S[c]&&S[c][a](b)},!D.browser.ie10&&!D.browser.ie11||b.onlyExternal||D.wrapper.classList.add("swiper-wp8-"+(N?"horizontal":"vertical")),b.freeMode&&(D.container.className+=" swiper-free-mode"),D.initialized=!1,D.init=function(a,c){var d=D.h.getWidth(D.container,!1,b.roundLengths),e=D.h.getHeight(D.container,!1,b.roundLengths);if(d!==D.width||e!==D.height||a){D.width=d,D.height=e;var f,g,h,i,j,k,l;J=N?d:e;var m=D.wrapper;if(a&&D.calcSlides(c),"auto"===b.slidesPerView){var n=0,o=0;b.slidesOffset>0&&(m.style.paddingLeft="",m.style.paddingRight="",m.style.paddingTop="",m.style.paddingBottom=""),m.style.width="",m.style.height="",b.offsetPxBefore>0&&(N?D.wrapperLeft=b.offsetPxBefore:D.wrapperTop=b.offsetPxBefore),b.offsetPxAfter>0&&(N?D.wrapperRight=b.offsetPxAfter:D.wrapperBottom=b.offsetPxAfter),b.centeredSlides&&(N?(D.wrapperLeft=(J-this.slides[0].getWidth(!0,b.roundLengths))/2,D.wrapperRight=(J-D.slides[D.slides.length-1].getWidth(!0,b.roundLengths))/2):(D.wrapperTop=(J-D.slides[0].getHeight(!0,b.roundLengths))/2,D.wrapperBottom=(J-D.slides[D.slides.length-1].getHeight(!0,b.roundLengths))/2)),N?(D.wrapperLeft>=0&&(m.style.paddingLeft=D.wrapperLeft+"px"),D.wrapperRight>=0&&(m.style.paddingRight=D.wrapperRight+"px")):(D.wrapperTop>=0&&(m.style.paddingTop=D.wrapperTop+"px"),D.wrapperBottom>=0&&(m.style.paddingBottom=D.wrapperBottom+"px")),k=0;var p=0;for(D.snapGrid=[],D.slidesGrid=[],h=0,l=0;l<D.slides.length;l++){f=D.slides[l].getWidth(!0,b.roundLengths),g=D.slides[l].getHeight(!0,b.roundLengths),b.calculateHeight&&(h=Math.max(h,g));var q=N?f:g;if(b.centeredSlides){var r=l===D.slides.length-1?0:D.slides[l+1].getWidth(!0,b.roundLengths),s=l===D.slides.length-1?0:D.slides[l+1].getHeight(!0,b.roundLengths),t=N?r:s;if(q>J){if(b.slidesPerViewFit)D.snapGrid.push(k+D.wrapperLeft),D.snapGrid.push(k+q-J+D.wrapperLeft);else for(var u=0;u<=Math.floor(q/(J+D.wrapperLeft));u++)D.snapGrid.push(0===u?k+D.wrapperLeft:k+D.wrapperLeft+J*u);D.slidesGrid.push(k+D.wrapperLeft)}else D.snapGrid.push(p),D.slidesGrid.push(p);p+=q/2+t/2}else{if(q>J)if(b.slidesPerViewFit)D.snapGrid.push(k),D.snapGrid.push(k+q-J);else if(0!==J)for(var v=0;v<=Math.floor(q/J);v++)D.snapGrid.push(k+J*v);else D.snapGrid.push(k);else D.snapGrid.push(k);D.slidesGrid.push(k)}k+=q,n+=f,o+=g}b.calculateHeight&&(D.height=h),N?(G=n+D.wrapperRight+D.wrapperLeft,b.cssWidthAndHeight&&"height"!==b.cssWidthAndHeight||(m.style.width=n+"px"),b.cssWidthAndHeight&&"width"!==b.cssWidthAndHeight||(m.style.height=D.height+"px")):(b.cssWidthAndHeight&&"height"!==b.cssWidthAndHeight||(m.style.width=D.width+"px"),b.cssWidthAndHeight&&"width"!==b.cssWidthAndHeight||(m.style.height=o+"px"),G=o+D.wrapperTop+D.wrapperBottom)}else if(b.scrollContainer)m.style.width="",m.style.height="",i=D.slides[0].getWidth(!0,b.roundLengths),j=D.slides[0].getHeight(!0,b.roundLengths),G=N?i:j,m.style.width=i+"px",m.style.height=j+"px",F=N?i:j;else{if(b.calculateHeight){for(h=0,j=0,N||(D.container.style.height=""),m.style.height="",l=0;l<D.slides.length;l++)D.slides[l].style.height="",h=Math.max(D.slides[l].getHeight(!0),h),N||(j+=D.slides[l].getHeight(!0));g=h,D.height=g,N?j=g:(J=g,D.container.style.height=J+"px")}else g=N?D.height:D.height/b.slidesPerView,b.roundLengths&&(g=Math.ceil(g)),j=N?D.height:D.slides.length*g;for(f=N?D.width/b.slidesPerView:D.width,b.roundLengths&&(f=Math.ceil(f)),i=N?D.slides.length*f:D.width,F=N?f:g,b.offsetSlidesBefore>0&&(N?D.wrapperLeft=F*b.offsetSlidesBefore:D.wrapperTop=F*b.offsetSlidesBefore),b.offsetSlidesAfter>0&&(N?D.wrapperRight=F*b.offsetSlidesAfter:D.wrapperBottom=F*b.offsetSlidesAfter),b.offsetPxBefore>0&&(N?D.wrapperLeft=b.offsetPxBefore:D.wrapperTop=b.offsetPxBefore),b.offsetPxAfter>0&&(N?D.wrapperRight=b.offsetPxAfter:D.wrapperBottom=b.offsetPxAfter),b.centeredSlides&&(N?(D.wrapperLeft=(J-F)/2,D.wrapperRight=(J-F)/2):(D.wrapperTop=(J-F)/2,D.wrapperBottom=(J-F)/2)),N?(D.wrapperLeft>0&&(m.style.paddingLeft=D.wrapperLeft+"px"),D.wrapperRight>0&&(m.style.paddingRight=D.wrapperRight+"px")):(D.wrapperTop>0&&(m.style.paddingTop=D.wrapperTop+"px"),D.wrapperBottom>0&&(m.style.paddingBottom=D.wrapperBottom+"px")),G=N?i+D.wrapperRight+D.wrapperLeft:j+D.wrapperTop+D.wrapperBottom,parseFloat(i)>0&&(!b.cssWidthAndHeight||"height"===b.cssWidthAndHeight)&&(m.style.width=i+"px"),parseFloat(j)>0&&(!b.cssWidthAndHeight||"width"===b.cssWidthAndHeight)&&(m.style.height=j+"px"),k=0,D.snapGrid=[],D.slidesGrid=[],l=0;l<D.slides.length;l++)D.snapGrid.push(k),D.slidesGrid.push(k),k+=F,parseFloat(f)>0&&(!b.cssWidthAndHeight||"height"===b.cssWidthAndHeight)&&(D.slides[l].style.width=f+"px"),parseFloat(g)>0&&(!b.cssWidthAndHeight||"width"===b.cssWidthAndHeight)&&(D.slides[l].style.height=g+"px")}D.initialized?(D.callPlugins("onInit"),b.onInit&&D.fireCallback(b.onInit,D)):(D.callPlugins("onFirstInit"),b.onFirstInit&&D.fireCallback(b.onFirstInit,D)),D.initialized=!0}},D.reInit=function(a){D.init(!0,a)},D.resizeFix=function(a){D.callPlugins("beforeResizeFix"),D.init(b.resizeReInit||a),b.freeMode?D.getWrapperTranslate()<-e()&&(D.setWrapperTransition(0),D.setWrapperTranslate(-e())):(D.swipeTo(b.loop?D.activeLoopIndex:D.activeIndex,0,!1),b.autoplay&&(D.support.transitions&&"undefined"!=typeof ab?"undefined"!=typeof ab&&(clearTimeout(ab),ab=void 0,D.startAutoplay()):"undefined"!=typeof bb&&(clearInterval(bb),bb=void 0,D.startAutoplay()))),D.callPlugins("afterResizeFix")},D.destroy=function(a){var c=D.h.removeEventListener,d="wrapper"===b.eventTarget?D.wrapper:D.container;if(D.browser.ie10||D.browser.ie11?(c(d,D.touchEvents.touchStart,p),c(document,D.touchEvents.touchMove,q),c(document,D.touchEvents.touchEnd,r)):(D.support.touch&&(c(d,"touchstart",p),c(d,"touchmove",q),c(d,"touchend",r)),b.simulateTouch&&(c(d,"mousedown",p),c(document,"mousemove",q),c(document,"mouseup",r))),b.autoResize&&c(window,"resize",D.resizeFix),h(),b.paginationClickable&&x(),b.mousewheelControl&&D._wheelEvent&&c(D.container,D._wheelEvent,j),b.keyboardControl&&c(document,"keydown",i),b.autoplay&&D.stopAutoplay(),a){D.wrapper.removeAttribute("style");for(var e=0;e<D.slides.length;e++)D.slides[e].removeAttribute("style")}D.callPlugins("onDestroy"),window.jQuery&&window.jQuery(D.container).data("swiper")&&window.jQuery(D.container).removeData("swiper"),window.Zepto&&window.Zepto(D.container).data("swiper")&&window.Zepto(D.container).removeData("swiper"),D=null},D.disableKeyboardControl=function(){b.keyboardControl=!1,D.h.removeEventListener(document,"keydown",i)},D.enableKeyboardControl=function(){b.keyboardControl=!0,D.h.addEventListener(document,"keydown",i)};var V=(new Date).getTime();if(D.disableMousewheelControl=function(){return D._wheelEvent?(b.mousewheelControl=!1,D.h.removeEventListener(D.container,D._wheelEvent,j),!0):!1},D.enableMousewheelControl=function(){return D._wheelEvent?(b.mousewheelControl=!0,D.h.addEventListener(D.container,D._wheelEvent,j),!0):!1},b.grabCursor){var W=D.container.style;W.cursor="move",W.cursor="grab",W.cursor="-moz-grab",W.cursor="-webkit-grab"}D.allowSlideClick=!0,D.allowLinks=!0;var X,Y,Z,$=!1,_=!0;D.swipeNext=function(a,c){"undefined"==typeof a&&(a=!0),!c&&b.loop&&D.fixLoop(),!c&&b.autoplay&&D.stopAutoplay(!0),D.callPlugins("onSwipeNext");var d=D.getWrapperTranslate().toFixed(2),f=d;if("auto"===b.slidesPerView){for(var g=0;g<D.snapGrid.length;g++)if(-d>=D.snapGrid[g].toFixed(2)&&-d<D.snapGrid[g+1].toFixed(2)){f=-D.snapGrid[g+1];break}}else{var h=F*b.slidesPerGroup;f=-(Math.floor(Math.abs(d)/Math.floor(h))*h+h)}return f<-e()&&(f=-e()),f===d?!1:(v(f,"next",{runCallbacks:a}),!0)},D.swipePrev=function(a,c){"undefined"==typeof a&&(a=!0),!c&&b.loop&&D.fixLoop(),!c&&b.autoplay&&D.stopAutoplay(!0),D.callPlugins("onSwipePrev");var d,e=Math.ceil(D.getWrapperTranslate());if("auto"===b.slidesPerView){d=0;for(var f=1;f<D.snapGrid.length;f++){if(-e===D.snapGrid[f]){d=-D.snapGrid[f-1];break}if(-e>D.snapGrid[f]&&-e<D.snapGrid[f+1]){d=-D.snapGrid[f];break}}}else{var g=F*b.slidesPerGroup;d=-(Math.ceil(-e/g)-1)*g}return d>0&&(d=0),d===e?!1:(v(d,"prev",{runCallbacks:a}),!0)},D.swipeReset=function(a){"undefined"==typeof a&&(a=!0),D.callPlugins("onSwipeReset");{var c,d=D.getWrapperTranslate(),f=F*b.slidesPerGroup;-e()}if("auto"===b.slidesPerView){c=0;for(var g=0;g<D.snapGrid.length;g++){if(-d===D.snapGrid[g])return;if(-d>=D.snapGrid[g]&&-d<D.snapGrid[g+1]){c=D.positions.diff>0?-D.snapGrid[g+1]:-D.snapGrid[g];break}}-d>=D.snapGrid[D.snapGrid.length-1]&&(c=-D.snapGrid[D.snapGrid.length-1]),d<=-e()&&(c=-e())}else c=0>d?Math.round(d/f)*f:0,d<=-e()&&(c=-e());return b.scrollContainer&&(c=0>d?d:0),c<-e()&&(c=-e()),b.scrollContainer&&J>F&&(c=0),c===d?!1:(v(c,"reset",{runCallbacks:a}),!0)},D.swipeTo=function(a,c,d){a=parseInt(a,10),D.callPlugins("onSwipeTo",{index:a,speed:c}),b.loop&&(a+=D.loopedSlides);var f=D.getWrapperTranslate();if(!(a>D.slides.length-1||0>a)){var g;return g="auto"===b.slidesPerView?-D.slidesGrid[a]:-a*F,g<-e()&&(g=-e()),g===f?!1:("undefined"==typeof d&&(d=!0),v(g,"to",{index:a,speed:c,runCallbacks:d}),!0)}},D._queueStartCallbacks=!1,D._queueEndCallbacks=!1,D.updateActiveSlide=function(a){if(D.initialized&&0!==D.slides.length){D.previousIndex=D.activeIndex,"undefined"==typeof a&&(a=D.getWrapperTranslate()),a>0&&(a=0);var c;if("auto"===b.slidesPerView){if(D.activeIndex=D.slidesGrid.indexOf(-a),D.activeIndex<0){for(c=0;c<D.slidesGrid.length-1&&!(-a>D.slidesGrid[c]&&-a<D.slidesGrid[c+1]);c++);var d=Math.abs(D.slidesGrid[c]+a),e=Math.abs(D.slidesGrid[c+1]+a);
D.activeIndex=e>=d?c:c+1}}else D.activeIndex=Math[b.visibilityFullFit?"ceil":"round"](-a/F);if(D.activeIndex===D.slides.length&&(D.activeIndex=D.slides.length-1),D.activeIndex<0&&(D.activeIndex=0),D.slides[D.activeIndex]){if(D.calcVisibleSlides(a),D.support.classList){var f;for(c=0;c<D.slides.length;c++)f=D.slides[c],f.classList.remove(b.slideActiveClass),D.visibleSlides.indexOf(f)>=0?f.classList.add(b.slideVisibleClass):f.classList.remove(b.slideVisibleClass);D.slides[D.activeIndex].classList.add(b.slideActiveClass)}else{var g=new RegExp("\\s*"+b.slideActiveClass),h=new RegExp("\\s*"+b.slideVisibleClass);for(c=0;c<D.slides.length;c++)D.slides[c].className=D.slides[c].className.replace(g,"").replace(h,""),D.visibleSlides.indexOf(D.slides[c])>=0&&(D.slides[c].className+=" "+b.slideVisibleClass);D.slides[D.activeIndex].className+=" "+b.slideActiveClass}if(b.loop){var i=D.loopedSlides;D.activeLoopIndex=D.activeIndex-i,D.activeLoopIndex>=D.slides.length-2*i&&(D.activeLoopIndex=D.slides.length-2*i-D.activeLoopIndex),D.activeLoopIndex<0&&(D.activeLoopIndex=D.slides.length-2*i+D.activeLoopIndex),D.activeLoopIndex<0&&(D.activeLoopIndex=0)}else D.activeLoopIndex=D.activeIndex;b.pagination&&D.updatePagination(a)}}},D.createPagination=function(a){if(b.paginationClickable&&D.paginationButtons&&x(),D.paginationContainer=b.pagination.nodeType?b.pagination:c(b.pagination)[0],b.createPagination){var d="",e=D.slides.length,f=e;b.loop&&(f-=2*D.loopedSlides);for(var g=0;f>g;g++)d+="<"+b.paginationElement+' class="'+b.paginationElementClass+'"></'+b.paginationElement+">";D.paginationContainer.innerHTML=d}D.paginationButtons=c("."+b.paginationElementClass,D.paginationContainer),a||D.updatePagination(),D.callPlugins("onCreatePagination"),b.paginationClickable&&y()},D.updatePagination=function(a){if(b.pagination&&!(D.slides.length<1)){var d=c("."+b.paginationActiveClass,D.paginationContainer);if(d){var e=D.paginationButtons;if(0!==e.length){for(var f=0;f<e.length;f++)e[f].className=b.paginationElementClass;var g=b.loop?D.loopedSlides:0;if(b.paginationAsRange){D.visibleSlides||D.calcVisibleSlides(a);var h,i=[];for(h=0;h<D.visibleSlides.length;h++){var j=D.slides.indexOf(D.visibleSlides[h])-g;b.loop&&0>j&&(j=D.slides.length-2*D.loopedSlides+j),b.loop&&j>=D.slides.length-2*D.loopedSlides&&(j=D.slides.length-2*D.loopedSlides-j,j=Math.abs(j)),i.push(j)}for(h=0;h<i.length;h++)e[i[h]]&&(e[i[h]].className+=" "+b.paginationVisibleClass);b.loop?void 0!==e[D.activeLoopIndex]&&(e[D.activeLoopIndex].className+=" "+b.paginationActiveClass):e[D.activeIndex]&&(e[D.activeIndex].className+=" "+b.paginationActiveClass)}else b.loop?e[D.activeLoopIndex]&&(e[D.activeLoopIndex].className+=" "+b.paginationActiveClass+" "+b.paginationVisibleClass):e[D.activeIndex]&&(e[D.activeIndex].className+=" "+b.paginationActiveClass+" "+b.paginationVisibleClass)}}}},D.calcVisibleSlides=function(a){var c=[],d=0,e=0,f=0;N&&D.wrapperLeft>0&&(a+=D.wrapperLeft),!N&&D.wrapperTop>0&&(a+=D.wrapperTop);for(var g=0;g<D.slides.length;g++){d+=e,e="auto"===b.slidesPerView?N?D.h.getWidth(D.slides[g],!0,b.roundLengths):D.h.getHeight(D.slides[g],!0,b.roundLengths):F,f=d+e;var h=!1;b.visibilityFullFit?(d>=-a&&-a+J>=f&&(h=!0),-a>=d&&f>=-a+J&&(h=!0)):(f>-a&&-a+J>=f&&(h=!0),d>=-a&&-a+J>d&&(h=!0),-a>d&&f>-a+J&&(h=!0)),h&&c.push(D.slides[g])}0===c.length&&(c=[D.slides[D.activeIndex]]),D.visibleSlides=c};var ab,bb;D.startAutoplay=function(){if(D.support.transitions){if("undefined"!=typeof ab)return!1;if(!b.autoplay)return;D.callPlugins("onAutoplayStart"),b.onAutoplayStart&&D.fireCallback(b.onAutoplayStart,D),A()}else{if("undefined"!=typeof bb)return!1;if(!b.autoplay)return;D.callPlugins("onAutoplayStart"),b.onAutoplayStart&&D.fireCallback(b.onAutoplayStart,D),bb=setInterval(function(){b.loop?(D.fixLoop(),D.swipeNext(!0,!0)):D.swipeNext(!0,!0)||(b.autoplayStopOnLast?(clearInterval(bb),bb=void 0):D.swipeTo(0))},b.autoplay)}},D.stopAutoplay=function(a){if(D.support.transitions){if(!ab)return;ab&&clearTimeout(ab),ab=void 0,a&&!b.autoplayDisableOnInteraction&&D.wrapperTransitionEnd(function(){A()}),D.callPlugins("onAutoplayStop"),b.onAutoplayStop&&D.fireCallback(b.onAutoplayStop,D)}else bb&&clearInterval(bb),bb=void 0,D.callPlugins("onAutoplayStop"),b.onAutoplayStop&&D.fireCallback(b.onAutoplayStop,D)},D.loopCreated=!1,D.removeLoopedSlides=function(){if(D.loopCreated)for(var a=0;a<D.slides.length;a++)D.slides[a].getData("looped")===!0&&D.wrapper.removeChild(D.slides[a])},D.createLoop=function(){if(0!==D.slides.length){D.loopedSlides="auto"===b.slidesPerView?b.loopedSlides||1:Math.floor(b.slidesPerView)+b.loopAdditionalSlides,D.loopedSlides>D.slides.length&&(D.loopedSlides=D.slides.length);var a,c="",d="",e="",f=D.slides.length,g=Math.floor(D.loopedSlides/f),h=D.loopedSlides%f;for(a=0;g*f>a;a++){var i=a;if(a>=f){var j=Math.floor(a/f);i=a-f*j}e+=D.slides[i].outerHTML}for(a=0;h>a;a++)d+=u(b.slideDuplicateClass,D.slides[a].outerHTML);for(a=f-h;f>a;a++)c+=u(b.slideDuplicateClass,D.slides[a].outerHTML);var k=c+e+E.innerHTML+e+d;for(E.innerHTML=k,D.loopCreated=!0,D.calcSlides(),a=0;a<D.slides.length;a++)(a<D.loopedSlides||a>=D.slides.length-D.loopedSlides)&&D.slides[a].setData("looped",!0);D.callPlugins("onCreateLoop")}},D.fixLoop=function(){var a;D.activeIndex<D.loopedSlides?(a=D.slides.length-3*D.loopedSlides+D.activeIndex,D.swipeTo(a,0,!1)):("auto"===b.slidesPerView&&D.activeIndex>=2*D.loopedSlides||D.activeIndex>D.slides.length-2*b.slidesPerView)&&(a=-D.slides.length+D.activeIndex+D.loopedSlides,D.swipeTo(a,0,!1))},D.loadSlides=function(){var a="";D.activeLoaderIndex=0;for(var c=b.loader.slides,d=b.loader.loadAllSlides?c.length:b.slidesPerView*(1+b.loader.surroundGroups),e=0;d>e;e++)a+="outer"===b.loader.slidesHTMLType?c[e]:"<"+b.slideElement+' class="'+b.slideClass+'" data-swiperindex="'+e+'">'+c[e]+"</"+b.slideElement+">";D.wrapper.innerHTML=a,D.calcSlides(!0),b.loader.loadAllSlides||D.wrapperTransitionEnd(D.reloadSlides,!0)},D.reloadSlides=function(){var a=b.loader.slides,c=parseInt(D.activeSlide().data("swiperindex"),10);if(!(0>c||c>a.length-1)){D.activeLoaderIndex=c;var d=Math.max(0,c-b.slidesPerView*b.loader.surroundGroups),e=Math.min(c+b.slidesPerView*(1+b.loader.surroundGroups)-1,a.length-1);if(c>0){var f=-F*(c-d);D.setWrapperTranslate(f),D.setWrapperTransition(0)}var g;if("reload"===b.loader.logic){D.wrapper.innerHTML="";var h="";for(g=d;e>=g;g++)h+="outer"===b.loader.slidesHTMLType?a[g]:"<"+b.slideElement+' class="'+b.slideClass+'" data-swiperindex="'+g+'">'+a[g]+"</"+b.slideElement+">";D.wrapper.innerHTML=h}else{var i=1e3,j=0;for(g=0;g<D.slides.length;g++){var k=D.slides[g].data("swiperindex");d>k||k>e?D.wrapper.removeChild(D.slides[g]):(i=Math.min(k,i),j=Math.max(k,j))}for(g=d;e>=g;g++){var l;i>g&&(l=document.createElement(b.slideElement),l.className=b.slideClass,l.setAttribute("data-swiperindex",g),l.innerHTML=a[g],D.wrapper.insertBefore(l,D.wrapper.firstChild)),g>j&&(l=document.createElement(b.slideElement),l.className=b.slideClass,l.setAttribute("data-swiperindex",g),l.innerHTML=a[g],D.wrapper.appendChild(l))}}D.reInit(!0)}},B()}};Swiper.prototype={plugins:{},wrapperTransitionEnd:function(a,b){"use strict";function c(h){if(h.target===f&&(a(e),e.params.queueEndCallbacks&&(e._queueEndCallbacks=!1),!b))for(d=0;d<g.length;d++)e.h.removeEventListener(f,g[d],c)}var d,e=this,f=e.wrapper,g=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"];if(a)for(d=0;d<g.length;d++)e.h.addEventListener(f,g[d],c)},getWrapperTranslate:function(a){"use strict";var b,c,d,e,f=this.wrapper;return"undefined"==typeof a&&(a="horizontal"===this.params.mode?"x":"y"),this.support.transforms&&this.params.useCSS3Transforms?(d=window.getComputedStyle(f,null),window.WebKitCSSMatrix?e=new WebKitCSSMatrix("none"===d.webkitTransform?"":d.webkitTransform):(e=d.MozTransform||d.OTransform||d.MsTransform||d.msTransform||d.transform||d.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),b=e.toString().split(",")),"x"===a&&(c=window.WebKitCSSMatrix?e.m41:parseFloat(16===b.length?b[12]:b[4])),"y"===a&&(c=window.WebKitCSSMatrix?e.m42:parseFloat(16===b.length?b[13]:b[5]))):("x"===a&&(c=parseFloat(f.style.left,10)||0),"y"===a&&(c=parseFloat(f.style.top,10)||0)),c||0},setWrapperTranslate:function(a,b,c){"use strict";var d,e=this.wrapper.style,f={x:0,y:0,z:0};3===arguments.length?(f.x=a,f.y=b,f.z=c):("undefined"==typeof b&&(b="horizontal"===this.params.mode?"x":"y"),f[b]=a),this.support.transforms&&this.params.useCSS3Transforms?(d=this.support.transforms3d?"translate3d("+f.x+"px, "+f.y+"px, "+f.z+"px)":"translate("+f.x+"px, "+f.y+"px)",e.webkitTransform=e.MsTransform=e.msTransform=e.MozTransform=e.OTransform=e.transform=d):(e.left=f.x+"px",e.top=f.y+"px"),this.callPlugins("onSetWrapperTransform",f),this.params.onSetWrapperTransform&&this.fireCallback(this.params.onSetWrapperTransform,this,f)},setWrapperTransition:function(a){"use strict";var b=this.wrapper.style;b.webkitTransitionDuration=b.MsTransitionDuration=b.msTransitionDuration=b.MozTransitionDuration=b.OTransitionDuration=b.transitionDuration=a/1e3+"s",this.callPlugins("onSetWrapperTransition",{duration:a}),this.params.onSetWrapperTransition&&this.fireCallback(this.params.onSetWrapperTransition,this,a)},h:{getWidth:function(a,b,c){"use strict";var d=window.getComputedStyle(a,null).getPropertyValue("width"),e=parseFloat(d);return(isNaN(e)||d.indexOf("%")>0||0>e)&&(e=a.offsetWidth-parseFloat(window.getComputedStyle(a,null).getPropertyValue("padding-left"))-parseFloat(window.getComputedStyle(a,null).getPropertyValue("padding-right"))),b&&(e+=parseFloat(window.getComputedStyle(a,null).getPropertyValue("padding-left"))+parseFloat(window.getComputedStyle(a,null).getPropertyValue("padding-right"))),c?Math.ceil(e):e},getHeight:function(a,b,c){"use strict";if(b)return a.offsetHeight;var d=window.getComputedStyle(a,null).getPropertyValue("height"),e=parseFloat(d);return(isNaN(e)||d.indexOf("%")>0||0>e)&&(e=a.offsetHeight-parseFloat(window.getComputedStyle(a,null).getPropertyValue("padding-top"))-parseFloat(window.getComputedStyle(a,null).getPropertyValue("padding-bottom"))),b&&(e+=parseFloat(window.getComputedStyle(a,null).getPropertyValue("padding-top"))+parseFloat(window.getComputedStyle(a,null).getPropertyValue("padding-bottom"))),c?Math.ceil(e):e},getOffset:function(a){"use strict";var b=a.getBoundingClientRect(),c=document.body,d=a.clientTop||c.clientTop||0,e=a.clientLeft||c.clientLeft||0,f=window.pageYOffset||a.scrollTop,g=window.pageXOffset||a.scrollLeft;return document.documentElement&&!window.pageYOffset&&(f=document.documentElement.scrollTop,g=document.documentElement.scrollLeft),{top:b.top+f-d,left:b.left+g-e}},windowWidth:function(){"use strict";return window.innerWidth?window.innerWidth:document.documentElement&&document.documentElement.clientWidth?document.documentElement.clientWidth:void 0},windowHeight:function(){"use strict";return window.innerHeight?window.innerHeight:document.documentElement&&document.documentElement.clientHeight?document.documentElement.clientHeight:void 0},windowScroll:function(){"use strict";return"undefined"!=typeof pageYOffset?{left:window.pageXOffset,top:window.pageYOffset}:document.documentElement?{left:document.documentElement.scrollLeft,top:document.documentElement.scrollTop}:void 0},addEventListener:function(a,b,c,d){"use strict";"undefined"==typeof d&&(d=!1),a.addEventListener?a.addEventListener(b,c,d):a.attachEvent&&a.attachEvent("on"+b,c)},removeEventListener:function(a,b,c,d){"use strict";"undefined"==typeof d&&(d=!1),a.removeEventListener?a.removeEventListener(b,c,d):a.detachEvent&&a.detachEvent("on"+b,c)}},setTransform:function(a,b){"use strict";var c=a.style;c.webkitTransform=c.MsTransform=c.msTransform=c.MozTransform=c.OTransform=c.transform=b},setTranslate:function(a,b){"use strict";var c=a.style,d={x:b.x||0,y:b.y||0,z:b.z||0},e=this.support.transforms3d?"translate3d("+d.x+"px,"+d.y+"px,"+d.z+"px)":"translate("+d.x+"px,"+d.y+"px)";c.webkitTransform=c.MsTransform=c.msTransform=c.MozTransform=c.OTransform=c.transform=e,this.support.transforms||(c.left=d.x+"px",c.top=d.y+"px")},setTransition:function(a,b){"use strict";var c=a.style;c.webkitTransitionDuration=c.MsTransitionDuration=c.msTransitionDuration=c.MozTransitionDuration=c.OTransitionDuration=c.transitionDuration=b+"ms"},support:{touch:window.Modernizr&&Modernizr.touch===!0||function(){"use strict";return!!("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch)}(),transforms3d:window.Modernizr&&Modernizr.csstransforms3d===!0||function(){"use strict";var a=document.createElement("div").style;return"webkitPerspective"in a||"MozPerspective"in a||"OPerspective"in a||"MsPerspective"in a||"perspective"in a}(),transforms:window.Modernizr&&Modernizr.csstransforms===!0||function(){"use strict";var a=document.createElement("div").style;return"transform"in a||"WebkitTransform"in a||"MozTransform"in a||"msTransform"in a||"MsTransform"in a||"OTransform"in a}(),transitions:window.Modernizr&&Modernizr.csstransitions===!0||function(){"use strict";var a=document.createElement("div").style;return"transition"in a||"WebkitTransition"in a||"MozTransition"in a||"msTransition"in a||"MsTransition"in a||"OTransition"in a}(),classList:function(){"use strict";var a=document.createElement("div");return"classList"in a}()},browser:{ie8:function(){"use strict";var a=-1;if("Microsoft Internet Explorer"===navigator.appName){var b=navigator.userAgent,c=new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);null!==c.exec(b)&&(a=parseFloat(RegExp.$1))}return-1!==a&&9>a}(),ie10:window.navigator.msPointerEnabled,ie11:window.navigator.pointerEnabled}},(window.jQuery||window.Zepto)&&!function(a){"use strict";a.fn.swiper=function(b){var c;return this.each(function(d){var e=a(this),f=new Swiper(e[0],b);d||(c=f),e.data("swiper",f)}),c}}(window.jQuery||window.Zepto),"undefined"!=typeof module?module.exports=Swiper:"function"==typeof define&&define.amd&&define([],function(){"use strict";return Swiper});
/*
 * # Semantic - Dimmer
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributor
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

$.fn.dimmer = function(parameters) {
  var
    $allModules     = $(this),

    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),

    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.dimmer.settings, parameters)
          : $.extend({}, $.fn.dimmer.settings),

        selector        = settings.selector,
        namespace       = settings.namespace,
        className       = settings.className,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,
        moduleSelector  = $allModules.selector || '',

        clickEvent      = ('ontouchstart' in document.documentElement)
          ? 'touchstart'
          : 'click',

        $module = $(this),
        $dimmer,
        $dimmable,

        element   = this,
        instance  = $module.data(moduleNamespace),
        module
      ;

      module = {

        preinitialize: function() {
          if( module.is.dimmer() ) {
            $dimmable = $module.parent();
            $dimmer   = $module;
          }
          else {
            $dimmable = $module;
            if( module.has.dimmer() ) {
              if(settings.dimmerName) {
                $dimmer = $dimmable.children(selector.dimmer).filter('.' + settings.dimmerName);
              }
              else {
                $dimmer = $dimmable.children(selector.dimmer);
              }
            }
            else {
              $dimmer = module.create();
            }
          }
        },

        initialize: function() {
          module.debug('Initializing dimmer', settings);
          if(settings.on == 'hover') {
            $dimmable
              .on('mouseenter' + eventNamespace, module.show)
              .on('mouseleave' + eventNamespace, module.hide)
            ;
          }
          else if(settings.on == 'click') {
            $dimmable
              .on(clickEvent + eventNamespace, module.toggle)
            ;
          }
          if( module.is.page() ) {
            module.debug('Setting as a page dimmer', $dimmable);
            module.set.pageDimmer();
          }

          if( module.is.closable() ) {
            module.verbose('Adding dimmer close event', $dimmer);
            $dimmer
              .on(clickEvent + eventNamespace, module.event.click)
            ;
          }
          module.set.dimmable();
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module', $dimmer);
          $module
            .removeData(moduleNamespace)
          ;
          $dimmable
            .off(eventNamespace)
          ;
          $dimmer
            .off(eventNamespace)
          ;
        },

        event: {
          click: function(event) {
            module.verbose('Determining if event occured on dimmer', event);
            if( $dimmer.find(event.target).length === 0 || $(event.target).is(selector.content) ) {
              module.hide();
              event.stopImmediatePropagation();
            }
          }
        },

        addContent: function(element) {
          var
            $content = $(element)
          ;
          module.debug('Add content to dimmer', $content);
          if($content.parent()[0] !== $dimmer[0]) {
            $content.detach().appendTo($dimmer);
          }
        },

        create: function() {
          var
            $element = $( settings.template.dimmer() )
          ;
          if(settings.variation) {
            module.debug('Creating dimmer with variation', settings.variation);
            $element.addClass(className.variation);
          }
          if(settings.dimmerName) {
            module.debug('Creating named dimmer', settings.dimmerName);
            $element.addClass(settings.dimmerName);
          }
          $element
            .appendTo($dimmable)
          ;
          return $element;
        },

        show: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.debug('Showing dimmer', $dimmer, settings);
          if( (!module.is.dimmed() || module.is.animating()) && module.is.enabled() ) {
            module.animate.show(callback);
            settings.onShow.call(element);
            settings.onChange.call(element);
          }
          else {
            module.debug('Dimmer is already shown or disabled');
          }
        },

        hide: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.is.dimmed() || module.is.animating() ) {
            module.debug('Hiding dimmer', $dimmer);
            module.animate.hide(callback);
            settings.onHide.call(element);
            settings.onChange.call(element);
          }
          else {
            module.debug('Dimmer is not visible');
          }
        },

        toggle: function() {
          module.verbose('Toggling dimmer visibility', $dimmer);
          if( !module.is.dimmed() ) {
            module.show();
          }
          else {
            module.hide();
          }
        },

        animate: {
          show: function(callback) {
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(settings.useCSS && $.fn.transition !== undefined && $dimmer.transition('is supported')) {
              $dimmer
                .transition({
                  animation : settings.transition + ' in',
                  queue       : false,
                  duration  : module.get.duration(),
                  onStart   : function() {
                    module.set.dimmed();
                  },
                  onComplete : function() {
                    module.set.active();
                    callback();
                  }
                })
              ;
            }
            else {
              module.verbose('Showing dimmer animation with javascript');
              module.set.dimmed();
              $dimmer
                .stop()
                .css({
                  opacity : 0,
                  width   : '100%',
                  height  : '100%'
                })
                .fadeTo(module.get.duration(), 1, function() {
                  $dimmer.removeAttr('style');
                  module.set.active();
                  callback();
                })
              ;
            }
          },
          hide: function(callback) {
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(settings.useCSS && $.fn.transition !== undefined && $dimmer.transition('is supported')) {
              module.verbose('Hiding dimmer with css');
              $dimmer
                .transition({
                  animation  : settings.transition + ' out',
                  queue      : false,
                  duration   : module.get.duration(),
                  onStart    : function() {
                    module.remove.dimmed();
                  },
                  onComplete : function() {
                    module.remove.active();
                    callback();
                  }
                })
              ;
            }
            else {
              module.verbose('Hiding dimmer with javascript');
              module.remove.dimmed();
              $dimmer
                .stop()
                .fadeOut(module.get.duration(), function() {
                  module.remove.active();
                  $dimmer.removeAttr('style');
                  callback();
                })
              ;
            }
          }
        },

        get: {
          dimmer: function() {
            return $dimmer;
          },
          duration: function() {
            if(typeof settings.duration == 'object') {
              if( module.is.active() ) {
                return settings.duration.hide;
              }
              else {
                return settings.duration.show;
              }
            }
            return settings.duration;
          }
        },

        has: {
          dimmer: function() {
            if(settings.dimmerName) {
              return ($module.children(selector.dimmer).filter('.' + settings.dimmerName).length > 0);
            }
            else {
              return ( $module.children(selector.dimmer).length > 0 );
            }
          }
        },

        is: {
          active: function() {
            return $dimmer.hasClass(className.active);
          },
          animating: function() {
            return ( $dimmer.is(':animated') || $dimmer.hasClass(className.animating) );
          },
          closable: function() {
            if(settings.closable == 'auto') {
              if(settings.on == 'hover') {
                return false;
              }
              return true;
            }
            return settings.closable;
          },
          dimmer: function() {
            return $module.is(selector.dimmer);
          },
          dimmable: function() {
            return $module.is(selector.dimmable);
          },
          dimmed: function() {
            return $dimmable.hasClass(className.dimmed);
          },
          disabled: function() {
            return $dimmable.hasClass(className.disabled);
          },
          enabled: function() {
            return !module.is.disabled();
          },
          page: function () {
            return $dimmable.is('body');
          },
          pageDimmer: function() {
            return $dimmer.hasClass(className.pageDimmer);
          }
        },

        can: {
          show: function() {
            return !$dimmer.hasClass(className.disabled);
          }
        },

        set: {
          active: function() {
            $dimmer.addClass(className.active);
          },
          dimmable: function() {
            $dimmable.addClass(className.dimmable);
          },
          dimmed: function() {
            $dimmable.addClass(className.dimmed);
          },
          pageDimmer: function() {
            $dimmer.addClass(className.pageDimmer);
          },
          disabled: function() {
            $dimmer.addClass(className.disabled);
          }
        },

        remove: {
          active: function() {
            $dimmer
              .removeClass(className.active)
            ;
          },
          dimmed: function() {
            $dimmable.removeClass(className.dimmed);
          },
          disabled: function() {
            $dimmer.removeClass(className.disabled);
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      module.preinitialize();

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          module.destroy();
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.dimmer.settings = {

  name        : 'Dimmer',
  namespace   : 'dimmer',

  debug       : false,
  verbose     : true,
  performance : true,

  dimmerName  : false,
  variation   : false,
  closable    : 'auto',
  transition  : 'fade',
  useCSS      : true,
  on          : false,

  duration    : {
    show : 500,
    hide : 500
  },

  onChange    : function(){},
  onShow      : function(){},
  onHide      : function(){},

  error   : {
    method   : 'The method you called is not defined.'
  },

  selector: {
    dimmable : '.dimmable',
    dimmer   : '.ui.dimmer',
    content  : '.ui.dimmer > .content, .ui.dimmer > .content > .center'
  },

  template: {
    dimmer: function() {
     return $('<div />').attr('class', 'ui dimmer');
    }
  },

  className : {
    active     : 'active',
    animating  : 'animating',
    dimmable   : 'dimmable',
    dimmed     : 'dimmed',
    disabled   : 'disabled',
    hide       : 'hide',
    pageDimmer : 'page',
    show       : 'show'
  }

};

})( jQuery, window , document );
$( document ).ready(function() {
    //Message - Button Close
    $('.message .close').on('click', function() {
        $(this).closest('.message').fadeOut();
    });

    //Accordion
    $('.ui.accordion')
        .accordion()
    ;

    //Popup
    $('.element-pop')
        .popup()
    ;

    //Tab
    $('.tabular .item')
        .tab()
    ;

});

