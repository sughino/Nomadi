function loginModal() {
    $('modal').empty();
    $('modal').append(`
        <div class="modal-container">
            <div class="image-container">
                <img src="assets/img/login_pic.jpg">
            </div>
            <div class="login-container">
                <i class="bi bi-x icon" id="close-modal"></i>
                <div class="login-title">
                    <h3>Welcome back to</h3>
                    <img src="assets/img/nomadi.svg" alt="nomadi-icon" class="nomadi-icon">
                    <h5 class="error"></h5>
                </div>
                <form class="login-input-container" autocomplete="off">
                    <div class="login-input">
                        <label for="email"><h4>E-mail</h4></label>
                        <input type="email" name="email" id="email" required>
                    </div>
                    <div class="login-input">
                        <label for="psw"><h4>Password</h4></label>
                        <input type="password" name="psw" id="psw" minlength="8" maxlength="15" required>
                        <i class="bi bi-eye-slash icon-smaller" id="show-psw"></i>
                    </div>
                    <div class="login-button-container">
                        <button type="submit" class="submit-form" id="submit-login"><h3>Submit</h3></button>
                        <h5 class="register">not registered yet?</h5>
                    </div>
                </form>
            </div>
        </div>
    `);
}
function registerModal() {
    $('modal').empty();
    $('modal').append(`
        <div class="modal-container">
            <div class="login-container">
                <i class="bi bi-x icon" id="close-modal-2"></i>
                <div class="login-title-2">
                    <h3>welcome to</h3>
                    <img src="assets/img/nomadi.svg" alt="nomadi-icon" class="nomadi-icon">
                    <h5 class="error"></h5>
                </div>
                <form class="register-input-container" autocomplete="off">
                    <div class="login-input">
                        <label for="name"><h4>Name</h4></label>
                        <input type="name" name="name" id="name" minlength="3" maxlength="30" pattern="^[a-zA-Z]+$" required>
                    </div>
                    <div class="login-input">
                        <label for="surname"><h4>Surname</h4></label>
                        <input type="name" name="surname" id="surname" minlength="3" maxlength="30" pattern="^[a-zA-Z]+$" required>
                    </div>
                    <div class="login-input">
                        <label for="email"><h4>E-mail</h4></label>
                        <input type="email" name="email" id="email" required>
                    </div>
                    <div class="login-input">
                        <label for="psw"><h4>Password</h4></label>
                        <input type="password" name="psw" id="psw" minlength="8" maxlength="15" required>
                        <i class="bi bi-eye-slash icon-smaller" id="show-psw"></i>
                    </div>
                    <div class="login-button-container-2">
                        <button type="submit" class="submit-form" id="submit-register"><h3>Submit</h3></button>
                        <h5 class="login">already registered?</h5>
                    </div>
                </form>
            </div>
            <div class="image-container">
                <img src="assets/img/register_pic.jpg">
            </div>
        </div>
    `);
}

//*open-close modal
$(document).on('click', '#open-modal', function() {
    if ($('.username').text() !== 'login') {
        $('.login-menu-container').show();
    } else {
        openModalLogin();
    }
});
$(document).click(function(event) {
    if (!$(event.target).closest('.login-menu-container').length && $('.login-menu-container').is(':visible') && !$(event.target).closest('#open-modal').length) {
        $('.login-menu-container').hide();
    }
});
function openModalLogin() {
    $(window).scrollTop(0);
    loginModal()
    $('modal').css('display', 'flex');
    $('body').css('overflow', 'hidden');
    setTimeout(function() {
        $('modal').css('background', 'var(--txt-clr-transparent)');
        $('modal').css('backdrop-filter', 'blur(3px)');
    }, 50);
    setTimeout(function() {
        $('.modal-container').css('transform', 'scale(1)');
    }, 100);
}

$(document).on('click', '#close-modal, #close-modal-2', function() {
    closeModalLogin()
});
function closeModalLogin() {
    $('.modal-container').css('transform', '');
    setTimeout(function() {
        $('modal').css('background', '');
        $('modal').css('backdrop-filter', '');
    }, 50);
    setTimeout(function() {
        $('modal').css('display', '');
        $('body').css('overflow', '');
    }, 500);
}

//*show psw
var isText = false;
$(document).on('click', '#show-psw', function() {
    $(this).toggleClass('bi-eye bi-eye-slash');
    if (isText) {
        $('#psw').attr("type", "password");
        isText = false;
    } else {
        $('#psw').attr("type", "text");
        isText = true;
    }
});

//*change login-register
$(document).on('click', '.register', function() {
    $('.modal-container').css('transform', '');
    setTimeout(function() {
        registerModal();
    }, 400);
    setTimeout(function() {
        $('.modal-container').css('transform', 'scale(1)');
    }, 450);
})
$(document).on('click', '.login', function() {
    $('.modal-container').css('transform', '');
    setTimeout(function() {
        loginModal();
    }, 400);
    setTimeout(function() {
        $('.modal-container').css('transform', 'scale(1)');
    }, 450);
})

//*submit form
$(document).on('submit', '.login-input-container', function(event) {
    event.preventDefault();
    insertLogData('login')
})
$(document).on('submit', '.register-input-container', function(event) {
    event.preventDefault();
    insertLogData('register')
})

function insertLogData(set) {
    let data = {
        email: $('#email').val(),
        psw: $('#psw').val()
    };
    if (set === 'register') {
        data.name = $('#name').val();
        data.surname = $('#surname').val();
    }
    $.ajax({
        url: `assets/server/${set}.php`,
        method: "POST",
        data: data,
        success: function(responseText) {
            $('.username').text(responseText);
            $('.error').empty();
            $('.login-input').find('input').css('outline', 'solid 1.5px var(--primary-clr)');
            setTimeout(function() {
                closeModalLogin();
            }, 450);
        },
        error: function(jqXHR) {
            $('.error').empty();
            $('.error').html(jqXHR.responseText);
            $('.login-input').find('input').css('outline', 'solid 1.5px var(--accent-clr)');
        }
    });
}

//*user menu
$('.login-menu-container').on('click', 'button', function() {
    $('.login-menu-container').hide();
});

function myTravels() {
    localStorage.setItem('myTravels', true);
    reservedPage()
}
function reservedPage() {
    window.location.replace("reservedArea.html");
}