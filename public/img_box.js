// Quelle: https://www.cssscript.com/fullscreen-image-viewer-lightbox/
var bg_color_img_box = 'rgba(255, 255, 255, 0.9)'
var allow_hide_scroll_img_box = 'yes'
var use_fade_inout_img_box = 'yes'
var speed_img_box = 0.08
var z_index_dv_img_box = 999
var vopa_img_box, idpopup_img_box

window.onload = function () {
    var crtdv_img_box = document.createElement('div')
    crtdv_img_box.id = 'img_box'
    document.getElementsByTagName('body')[0].appendChild(crtdv_img_box)
    idpopup_img_box = document.getElementById("img_box")
    idpopup_img_box.style.top = 0
    idpopup_img_box.style.left = 0
    idpopup_img_box.style.opacity = 0
    idpopup_img_box.style.width = '100%'
    idpopup_img_box.style.height = '100%'
    idpopup_img_box.style.display = 'none'
    idpopup_img_box.style.position = 'fixed'
    idpopup_img_box.style.cursor = 'pointer'
    idpopup_img_box.style.textAlign = 'center'
    idpopup_img_box.style.zIndex = z_index_dv_img_box
    idpopup_img_box.style.backgroundColor = bg_color_img_box
}

function img_box(self) {
    var namepic_img_box = typeof self === 'string' ? self : self.src
    vopa_img_box = 0

    idpopup_img_box.style["background-size"] = "contain";
    idpopup_img_box.style["background-image"] = "url('" + namepic_img_box + "')";
    idpopup_img_box.style["background-repeat"] = "no-repeat";
    idpopup_img_box.style["background-position"] = "center";

    if (allow_hide_scroll_img_box == 'yes') {
        document.body.style.overflow = 'hidden'
    }
    idpopup_img_box.style.display = 'block'

    if (use_fade_inout_img_box == 'yes') {
        idfadein_img_box = setInterval(function () {
            if (vopa_img_box <= 1.1) {
                idpopup_img_box.style.opacity = vopa_img_box
                vopa_img_box += speed_img_box
            }
            else {
                idpopup_img_box.style.opacity = 1
                clearInterval(idfadein_img_box)
            }
        }, 10)
    }
    else {
        idpopup_img_box.style.opacity = 1
    }

    idpopup_img_box.onclick = function () {
        if (use_fade_inout_img_box == 'yes') {
            var idfadeout_img_box = setInterval(function () {
                if (vopa_img_box >= 0) {
                    idpopup_img_box.style.opacity = vopa_img_box
                    vopa_img_box -= speed_img_box
                } else {
                    idpopup_img_box.style.opacity = 0
                    clearInterval(idfadeout_img_box)
                    idpopup_img_box.style.display = 'none'
                    idpopup_img_box.innerHTML = ''
                    document.body.style.overflow = 'visible'
                    vopa_img_box = 0
                }
            }, 10)
        }
        else {
            idpopup_img_box.style.opacity = 0
            idpopup_img_box.style.display = 'none'
            idpopup_img_box.innerHTML = ''
            document.body.style.overflow = 'visible'
        }
    }
}