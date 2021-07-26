;(function () {
    // 'use strict';
    var masking = {
      // User defined Values
      //maskedInputs : document.getElementsByClassName('masked'), // add with IE 8's death
      maskedInputs: document.querySelectorAll('.masked'), // kill with IE 8's death
      maskedNumber: 'XdDmMyY9',
      maskedLetter: '_',

      init: function () {
        masking.setUpMasks(masking.maskedInputs)
        masking.maskedInputs = document.querySelectorAll('.masked') // Repopulating. Needed b/c static node list was created above.
        masking.activateMasking(masking.maskedInputs)
      },

      setUpMasks: function (inputs) {
        var i,
          l = inputs.length

        for (i = 0; i < l; i++) {
          masking.createShell(inputs[i])
        }
      },

      // replaces each masked input with a shall containing the input and it's mask.
      createShell: function (input) {
        var text = '',
          placeholder = input.getAttribute('placeholder')

        input.setAttribute('maxlength', placeholder.length)
        input.setAttribute('data-placeholder', placeholder)
        input.removeAttribute('placeholder')

        text =
          '<span class="shell">' +
          '<span aria-hidden="true" id="' +
          input.id +
          'Mask"><i></i>' +
          placeholder +
          '</span>' +
          input.outerHTML +
          '</span>'

        input.outerHTML = text
      },

      setValueOfMask: function (e) {
        var value = e.target.value,
          placeholder = e.target.getAttribute('data-placeholder')

        return '<i>' + value + '</i>' + placeholder.substr(value.length)
      },

      // add event listeners
      activateMasking: function (inputs) {
        var i, l

        for (i = 0, l = inputs.length; i < l; i++) {
          if (masking.maskedInputs[i].addEventListener) {
            // remove "if" after death of IE 8
            masking.maskedInputs[i].addEventListener(
              'keyup',
              function (e) {
                masking.handleValueChange(e)
              },
              false
            )
          } else if (masking.maskedInputs[i].attachEvent) {
            // For IE 8
            masking.maskedInputs[i].attachEvent('onkeyup', function (e) {
              e.target = e.srcElement
              masking.handleValueChange(e)
            })
          }
        }
      },

      handleValueChange: function (e) {
        var id = e.target.getAttribute('id')

        switch (
          e.keyCode // allows navigating thru input
        ) {
          case 20: // caplocks
          case 17: // control
          case 18: // option
          case 16: // shift
          case 37: // arrow keys
          case 38:
          case 39:
          case 40:
          case 9: // tab (let blur handle tab)
            return
        }

        document.getElementById(id).value = masking.handleCurrentValue(e)
        document.getElementById(
          id + 'Mask'
        ).innerHTML = masking.setValueOfMask(e)
      },

      handleCurrentValue: function (e) {
        var isCharsetPresent = e.target.getAttribute('data-charset'),
          placeholder =
            isCharsetPresent || e.target.getAttribute('data-placeholder'),
          value = e.target.value,
          l = placeholder.length,
          newValue = '',
          i,
          j,
          isInt,
          isLetter,
          strippedValue

        // strip special characters
        strippedValue = isCharsetPresent
          ? value.replace(/\W/g, '')
          : value.replace(/\D/g, '')

        for (i = 0, j = 0; i < l; i++) {
          var x = (isInt = !isNaN(parseInt(strippedValue[j])))
          isLetter = strippedValue[j]
            ? strippedValue[j].match(/[A-Z]/i)
            : false
          matchesNumber = masking.maskedNumber.indexOf(placeholder[i]) >= 0
          matchesLetter = masking.maskedLetter.indexOf(placeholder[i]) >= 0

          if (
            (matchesNumber && isInt) ||
            (isCharsetPresent && matchesLetter && isLetter)
          ) {
            newValue += strippedValue[j++]
          } else if (
            (!isCharsetPresent && !isInt && matchesNumber) ||
            (isCharsetPresent &&
              ((matchesLetter && !isLetter) || (matchesNumber && !isInt)))
          ) {
            // masking.errorOnKeyEntry(); // write your own error handling function
            return newValue
          } else {
            newValue += placeholder[i]
          }
          // break if no characters left and the pattern is non-special character
          if (strippedValue[j] == undefined) {
            break
          }
        }
        if (e.target.getAttribute('data-valid-example')) {
          return masking.validateProgress(e, newValue)
        }
        return newValue
      },

      validateProgress: function (e, value) {
        var validExample = e.target.getAttribute('data-valid-example'),
          pattern = new RegExp(e.target.getAttribute('pattern')),
          placeholder = e.target.getAttribute('data-placeholder'),
          l = value.length,
          testValue = ''

        //convert to months
        if (l == 1 && placeholder.toUpperCase().substr(0, 2) == 'MM') {
          if (value > 1 && value < 10) {
            value = '0' + value
          }
          return value
        }
        // test the value, removing the last character, until what you have is a submatch
        for (i = l; i >= 0; i--) {
          testValue = value + validExample.substr(value.length)
          if (pattern.test(testValue)) {
            return value
          } else {
            value = value.substr(0, value.length - 1)
          }
        }

        return value
      },

      errorOnKeyEntry: function () {
        // Write your own error handling
      }
    }

    masking.init()
    window.addEventListener(
      'load',
      function () {
        function invalidFeedback (inputID, message) {
          console.log(inputID)
          console.log(message)
          $('#' + inputID)
            .removeClass('is-valid is-invalid')
            .addClass('is-invalid') // styles for input
            .closest('.form-group')
            .removeClass('valid invalid')
            .addClass('invalid') // styles for feedback
            .find('.feedback')
            .removeClass('valid-feedback invalid-feedback')
            .addClass('invalid-feedback')
            .text(message)
        }

        function validFeedback (inputID, message) {
          console.log(inputID)
          console.log(message)
          $('#' + inputID)
            .removeClass('is-valid is-invalid')
            .addClass('is-valid') // styles for input
            .closest('.form-group')
            .addClass('valid') // styles for feedback
            .find('.feedback')
            .text(message)
        }

        $('body').on('blur', '.form-control', function () {
          var _this = this
          $(this).each(function () {
            var type = $(this).data('validate')

            console.log(type)
            if (type === 'year') {
              var valid = /^(19|20)\d{2}$/.test(this.value)
              var inputID = $(this).attr('id')
              var invalidMsg = 'Enter 4 digit year. e.g. 1972'
              var validMsg = 'Looks good!'
              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            } 
            
            else if (type === 'date') {
              var valid = /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/.test(
                this.value
              )
              var inputID = $(this).attr('id')
              var invalidMsg =
                'Enter full date with 2 digit month, 2 digit day and 4 digit year. e.g. 0 1 0 1 2 0 0 1'
              var validMsg = 'Looks good!'
              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            } 
            
            else if (type === 'patid') {
              var valid = /[a-zA-Z0-9]+/.test(this.value)
              var inputID = $(this).attr('id')
              var invalidMsg =
                'Enter alphanumeric characters only for patient id. e.g. MR12345678'
              var validMsg = 'Looks good!'
              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            } 
            
            else if (type === 'ssn4') {
              var valid = /[0-9]{4}+/.test(this.value)
              var inputID = $(this).attr('id')
              var invalidMsg =
                'Enter the last 4 digits of the social security number. e.g. 0000'
              var validMsg = 'Looks good!'
              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            } 
            
            else if (type === 'name') {
              var valid = /([A-Z][a-z]{3,} )([A-Z][a-z]{3,} )?([A-Z][a-z]{3,})/.test(this.value)
              var inputID = $(this).attr('id')
              var invalidMsg =
                'Insira seu nome completo e sem caracteres especiais'
              var validMsg = 'Tudo certo!'
              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            }

            else if (type === 'email') {
              var valid = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(this.value)
              var inputID = $(this).attr('id')
              var invalidMsg = 'Por favor, insira um email válido'
              var validMsg = 'Tudo certo!'
              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            }

            else if (type === 'cpf') {
              var valid = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(this.value)
              var inputID = $(this).attr('id')
              var invalidMsg = 'invalid cpf'
              var validMsg = 'valid cpf'

              // clean(inputId)

              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            }

            else if (type === 'phone') {
              var valid = /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/.test(this.value)
              var inputID = $(this).attr('id')
              var invalidMsg =
                'invalid phone'
              var validMsg = 'valid phone'
              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            }

            else if (type === 'password') {
              var valid = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!&*]).{8,40})/.test(this.value)
              var inputID = $(this).attr('id')
              var invalidMsg =
                'A senha deve conter letras maiúsculas e minúsculas, números, caracteres especiais e ao menos 8 dígitos.'
              var validMsg = 'Tudo certo!'
              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            }

            else if (type === 'confirm_password') {
              var valid = (this.value == document.getElementById('password').value) && document.getElementById('password').value !== "" 
              var inputID = $(this).attr('id')
              var invalidMsg =
                'As senhas não correspondem.'
              var validMsg = 'Tudo certo!'
              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            }

            else if (type === 'cep') {
              var valid = /[0-9]{5}-[\d]{3}/.test(this.value)
              var inputID = $(this).attr('id')
              var invalidMsg = 'CEP Inválido'
              var validMsg = 'CEP inválido'
              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            }

            else if (type === 'cnpj') {
              var valid = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(this.value)
              var inputID = $(this).attr('id')
              var invalidMsg = 'CEP Inválido'
              var validMsg = 'CEP inválido'

              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            }

            else if (type === 'empresa') {
              var valid = /^[.@&]?[a-zA-Z0-9 ]+[ !.@&()]?[ a-zA-Z0-9!()]+/.test(this.value)
              var inputID = $(this).attr('id')
              var invalidMsg =
                'Por favor, verifique o nome da empresa'
              var validMsg = 'Tudo certo!'
              if (valid === false) {
                invalidFeedback(inputID, invalidMsg)
              } else {
                validFeedback(inputID, validMsg)
              }
            }

          })

        }) // End: Form Control on Blur Event Listener

        function clean(input) {
          if(input !== null) {
            return input.replace(/[^A-Z0-9]/ig, "");            
          }
        }

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation')

        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (
          form
        ) {
          form.addEventListener(
            'submit',
            function (event) {

              if (form.checkValidity() === false) {
                event.preventDefault()
                event.stopPropagation()
              } else {
                var cep = document.getElementById('cep');
                var telefone = document.getElementById('telefone');
                
                cep.value = clean(cep.value);
                telefone.value = clean(telefone.value);

                var cpf = document.getElementById('cpf');
                cpf.value = clean(cpf.value);

                var cnpj = document.getElementById('cnpj');
                cnpj.value = clean(cnpj.value);
   
                document.getElementById("validation").submit();
              }

              event.preventDefault();
              event.stopPropagation();

              form.classList.add('was-validated')
              
            },
            false
          ) // End Submit Listener
        })
      },
      false
    ) // End Load Listener
  })()