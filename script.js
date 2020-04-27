"use strict";


const storage = firebase.storage();
var storageRef = storage.ref();

auth.onAuthStateChanged(user => {
  if (user) {
    console.log("user in");
    $("#logout").show();
    $("#loginbtn").hide();
  } else {
    console.log("user out");
    $("#logout").hide();
    $("#loginbtn").show();
  }
});

//storage to db

// storageRef
//   .child("/images/")
//   .listAll()
//   .then(function(result) {
//      var img_id = 0;
//     result.items.forEach(function(imageRef) {
//       console.log("Image Reference" + imageRef.toString());

//       var cur = auth.currentUser;
//       var user_uid = cur.uid;

//       var rootRef = db.ref('users/'+user_uid+'/images');

//       var imgRef = imageRef.toString();
//       imageRef.getDownloadURL().then(function(url) {
//         rootRef.child(img_id).set({
//           img_url: url
//         });
//         img_id++;
//       });

//     });
//   });

//likes

function trigger(snap1, snap3) {
  var user = auth.currentUser;
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log(user.uid);
      const like_user_id = user.uid;
      like(snap1, snap3, like_user_id);
    } else {
      console.log(user);

      $("#signupmodal").modal("show");
    }
  });
}

function like(user_id, img_id, like_user_id) {
  // const img_url = document.getElementById("img_src").src;
  //var uid = firebase.auth().currentUser;
  var user = auth.currentUser;
  console.log(user.uid);
  var u_id = user.uid;
  var obj = {
    user_uid: u_id
  };
  var rootRef = db
    .ref("registeredusers/" + user_id + "/images/" + img_id + "/Likes")
    .push(obj)
    .then(function() {
      var ref = db.ref(
        "registeredusers/" + user_id + "/images/" + img_id + "/Likes"
      );
      ref.once("value", function(snap) {
        document.getElementById(img_id).innerHTML = snap.numChildren();
      });
      
    });
  var checkbox = document.getElementById("likecheck");
  //var checkbox1 = document.getElementById("likecheck1");
  checkbox.addEventListener("change", function(e){ 
    if (checkbox.checked == false) {
      console.log("inside false check");
      var rotRef = db.ref(
        "registeredusers/" + user_id + "/images/" + img_id + "/Likes/"
      );
    
    rotRef
        .orderByChild("user_uid")
        .equalTo(like_user_id)
        .once("value", function(snap) {
          var foundUser = snap.val();
          console.log(foundUser);
          for (let key of Object.keys(foundUser)) {
            rotRef.child(key).remove();
          }
          rotRef.once("value", function(snap) {
            document.getElementById(img_id).innerHTML = snap.numChildren();
          });
        });
  }
  });
                            
  
  
    /*checkbox1.addEventListener("change", function(e) {
    if (checkbox1.checked == false) {
      console.log("inside false check");
      var rotRef = db.ref(
        "registeredusers/" + user_id + "/images/" + img_id + "/Likes/"
      );
    
      rotRef
        .orderByChild("user_uid")
        .equalTo(like_user_id)
        .once("value", function(snap) {
          var foundUser = snap.val();
          console.log(foundUser);
          for (let key of Object.keys(foundUser)) {
            rotRef.child(key).remove();
          }
          rotRef.once("value", function(snap) {
            document.getElementById(img_id).innerHTML = snap.numChildren();
          });
        });
    }
  });
    /*if (checkbox.checked == false) {
      console.log("inside false check");
      var rotRef = db.ref("registeredusers/" + user_id + "/images/" + img_id + "/Likes/");
      rotRef
        .orderByChild("user_uid")
        .equalTo(like_user_id)
        .once("value", function(snap) {
          var foundUser = snap.val();
          console.log(foundUser);
        for (let key of Object.keys(foundUser)) {
            rotRef.child(key).remove();
        }
        rotRef.once("value", function(snap) {
        document.getElementById(img_id).innerHTML = snap.numChildren();
      });
        });

      //var rootRef = db.ref('registeredusers/'+user_id+'/images/'+img_id+'/Likes').remove(obj).then(function(){
      
      
      //});
    }*/
  
}
 
  
//login

const logi = document.querySelector("#login_form");
logi.addEventListener("submit", e => {
  e.preventDefault();

  const email = logi["form211"].value;
  const psw = logi["form111"].value;

  var error = document.getElementById("errormsg");
  var vemail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  var validpass = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{6,20}$/g;
  if (email == "") {
    error.innerHTML = "Enter Your Email";
  } else if (psw == "") {
    error.innerHTML = "Enter Your Password";
  } else if (!email.match(vemail)) {
    error.innerHTML = "Invalid Email";
  } else {
    error.innerHTML = "Logging in";
    auth
      .signInWithEmailAndPassword(email, psw)
      .then(cred => {
        //console.log(cred.user);
        logi.reset();
       
        // window.location.href = "index.html";
        location.reload();

        //document.getElementById("loginbtn").style.display='none';
      })
      .catch(function(err) {
        error.innerHTML = err;
      });
  }
});

//signup
const sup = document.querySelector("#form");
sup.addEventListener("submit", e => {
  e.preventDefault();

  const email = sup["form21"].value;
  const psw = sup["form11"].value;
  const cpsw = sup["cpass"].value;
  const uname = sup["form2111"].value;
  var vemail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  var validpass = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{6,20}$/g;
  var error2 = document.getElementById("errormsg1");
  if (email == "") {
    error2.innerHTML = "Enter Your Email";
  } else if (psw == "") {
    error2.innerHTML = "Enter Your Password";
  } else if (cpsw == "") {
    error2.innerHTML = "Please Retype Password";
  } else if (uname == "") {
    error.innerHTML = "Enter a Username";
  } else if (!email.match(vemail)) {
    error2.innerHTML = "Invalid Email";
  } else if (!psw.match(validpass)) {
    error2.innerHTML =
      "Set a Stronger Password min:6 characters, 1 uppercase 1 digit and 1 spcl character required";
  } else if (!cpsw.match(psw)) {
    error2.innerHTML = "Passwords do not Match";
  } else {
    error2.innerHTML = "Authenticating...";

    auth
      .createUserWithEmailAndPassword(email, psw)
      .then(cred => {
        console.log(cred.user.uid);
        sup.reset();
        var rotRef = db.ref("registeredusers/signed_users");
        //var rotRef = db.ref("users/User_uid/images/img_id/comment")
        const autoId = auth.currentUser.uid;

        var obj = {
          name: uname,
          email: email,
          user_uid: autoId
        };
        rotRef.child(autoId).set(obj);

        $("#loginmodal").modal("show");
      })
      .catch(function(err1) {
        error2.innerHTML = err1;
      });
  }
});

//signout
const logout = document.querySelector("#logout");
logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("user signed out");
    $("#logout").hide();
    location.reload();
  });
});

//comment

function post(snap1, snap3) {
  var user = auth.currentUser;
  
  if (user) {
    console.log(user.uid);
    const cmnt_uid = user.uid;
    comment(snap1, snap3, cmnt_uid);
  } else {
    console.log(user);

    $("#signupmodal").modal("show");
  }
}
function comment(user_id, img_id, cmnt_uid) {
  const comment = document.querySelector("#com");
  var rotRef = db.ref("registeredusers/signed_users");

  rotRef
    .orderByChild("user_uid")
    .equalTo(cmnt_uid)
    .on("value", function(snap) {
      //var foundUser = snap.val();
      console.log(snap.val());
      snap.forEach(function(snapy) {
        var key = snapy.key;
        var childData = snapy.val();

        //this will be the actual email value found
        const name_1 = childData.name;
        var obj = {
          comment: comment.value,
          name: name_1
        };
        var rootRef = db
          .ref(
            "registeredusers/" + user_id + "/images/" + img_id + "/Comments/"
          )
          .push(obj)
          .then(function() {
            var ref = db.ref(
              "registeredusers/" + user_id + "/images/" + img_id + "/Comments/"
            );
            document.getElementById("com").reset();
          });

      });
    
    });

}









//Preloader
var preloader = $('#spinner-wrapper');
$(window).on('load', function() {
    var preloaderFadeOutTime = 500;

    function hidePreloader() {
        preloader.fadeOut(preloaderFadeOutTime);
    }
    hidePreloader();
});

jQuery(document).ready(function($) {

    //Incremental Coutner
    if ($.isFunction($.fn.incrementalCounter))
        $("#incremental-counter").incrementalCounter();

    //For Trigering CSS3 Animations on Scrolling
    if ($.isFunction($.fn.appear))
        $(".slideDown, .slideUp").appear();

    $(".slideDown, .slideUp").on('appear', function(event, $all_appeared_elements) {
        $($all_appeared_elements).addClass('appear');
    });

    //For Header Appearing in Homepage on Scrolling
    var lazy = $('#header.lazy-load')

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 200) {
            lazy.addClass('visible');
        } else {
            lazy.removeClass('visible');
        }
    });

    //Initiate Scroll Styling
    if ($.isFunction($.fn.scrollbar))
        $('.scrollbar-wrapper').scrollbar();

    if ($.isFunction($.fn.masonry)) {

        // fix masonry layout for chrome due to video elements were loaded after masonry layout population
        // we are refreshing masonry layout after all video metadata are fetched.
        var vElem = $('.img-wrapper video');
        var videoCount = vElem.length;
        var vLoaded = 0;

        vElem.each(function(index, elem) {

            //console.log(elem, elem.readyState);

            if (elem.readyState) {
                vLoaded++;

                if (count == vLoaded) {
                    $('.js-masonry').masonry('layout');
                }

                return;
            }

            $(elem).on('loadedmetadata', function() {
                vLoaded++;
                //console.log('vLoaded',vLoaded, this);
                if (videoCount == vLoaded) {
                    $('.js-masonry').masonry('layout');
                }
            })
        });


        // fix masonry layout for chrome due to image elements were loaded after masonry layout population
        // we are refreshing masonry layout after all images are fetched.
        var $mElement = $('.img-wrapper img');
        var count = $mElement.length;
        var loaded = 0;

        $mElement.each(function(index, elem) {

            if (elem.complete) {
                loaded++;

                if (count == loaded) {
                    $('.js-masonry').masonry('layout');
                }

                return;
            }

            $(elem).on('load', function() {
                loaded++;
                if (count == loaded) {
                    $('.js-masonry').masonry('layout');
                }
            })
        });

    } // end of `if masonry` checking


    //Fire Scroll and Resize Event
    $(window).trigger('scroll');
    $(window).trigger('resize');
});

/**
 * function for attaching sticky feature
 **/

function attachSticky() {
    // Sticky Chat Block
    $('#chat-block').stick_in_parent({
        parent: '#page-contents',
        offset_top: 70
    });

    // Sticky Right Sidebar
    $('#sticky-sidebar').stick_in_parent({
        parent: '#page-contents',
        offset_top: 70
    });

}

// Disable Sticky Feature in Mobile
$(window).on("resize", function() {

    if ($.isFunction($.fn.stick_in_parent)) {
        // Check if Screen wWdth is Less Than or Equal to 992px, Disable Sticky Feature
        if ($(this).width() <= 992) {
            $('#chat-block').trigger('sticky_kit:detach');
            $('#sticky-sidebar').trigger('sticky_kit:detach');

            return;
        } else {

            // Enabling Sticky Feature for Width Greater than 992px
            attachSticky();
        }

        // Firing Sticky Recalculate on Screen Resize
        return function(e) {
            return $(document.body).trigger("sticky_kit:recalc");
        };
    }
});

// Fuction for map initialization
function initMap() {
  var uluru = {lat: 12.927923, lng: 77.627108};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: uluru,
    zoomControl: true,
    scaleControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true
  });
  
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}
