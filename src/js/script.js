
jQuery(function ($) { // この中であればWordpressでも「$」が使用可能になる

  var topBtn = $('.js-pagetop');
  topBtn.hide();

  //ボタンをクリックしたらスクロールして上に戻る
  /* トップへ戻るボタンクリック時のスムーススクロール */
  topBtn.click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 300, 'swing');
    return false;
  });


  /* トップビューすぎたらトップへ戻るボタン表示 */
  $(window).on('load scroll', function() {
    let tvHeight = $('.js-top-view').outerHeight();
    let pageTop = $('.js-pagetop');
    let scrollTop = $(window).scrollTop();

    if( tvHeight ) {//メインビジュアルの高さ取得時
      if( scrollTop > tvHeight ) {
        pageTop.fadeIn();
      } else {
        pageTop.fadeOut();
      }
    }
  });


  // //ドロワーメニュー
  // // ナビバートグル クリック動作
	// $('.js-hamburger').on('click', function () {
	// 	if( $(this).hasClass('open') ) {
	// 		$(this).removeClass('open');
	// 		$('.js-drawer-menu').fadeOut(); // ドロワーメニュー
	// 		// $('.js-overlay').fadeOut(); // オーバーレイ
	// 	} else {
	// 		$(this).addClass('open');
	// 		$('.js-drawer-menu').fadeIn(); // ドロワーメニュー
	// 		// $('.js-overlay').fadeIn(); // オーバーレイ
	// 	}
	// });
	// // SP時ドロワーメニュー
	// $(window).on('resize load', function() {
	// 	var width = $(window).width();
	// 	if( width > 767) {
	// 		// $('.p-header__drawer').css('display', 'none');
	// 		// $('.js-drawer-menu').css('display', 'block');
	// 	} else {
	// 		$('.js-drawer-menu').css('display', 'none');
	// 		$('.js-hamburger').removeClass('open');
	// 	}
	// });

  /* ドロワーメニュー（ボタン） */
  $('.js-hamburger').click(function () {
    $('body').toggleClass('is-drawerActive');
    // スクロール停止の処理
    $('body').css('overflow','hidden');
    // window.addEventListener( 'touchmove' , move , { passive: false } );

    if ($(this).attr('aria-expanded') == 'false') {
      $(this).attr('aria-expanded', true);
      $('.js-drawer-menu').fadeIn();
      $('.js-drawer-menu').addClass('click-close');
    } else {
      $(this).attr('aria-expanded', false);
      $('.js-drawer-menu').fadeOut();
      $('.js-drawer-menu').removeClass('click-close');
      //  iosスクロール許可(スクロール停止を停止)
      $('body').css('overflow','');
      window.removeEventListener( 'touchmove' , move, { passive: false } );
    }
  });
  //PCサイズの時
  $(window).on('load resize', function() {
    var width = $(window).width();
    if( width < 768 ) { // 767px以下
      
    } else { // 768px以上
      //aria-expandedをfalse
      $('.js-hamburger').attr('aria-expanded', false);
      //付与されたスタイルをリセット
      $('.js-drawer-menu').removeAttr('style');
    }
  });
  /* (SP)ドロワーメニュークリックしたら、ドロワーを閉じる */
  $(window).on('load resize', function() {
    var width = $(window).width();
    if( width < 768 ) { // 767px以下
      $('.p-drawer-menu__link').on('click', function() {
        $('.js-hamburger').attr('aria-expanded', false);
        $('.js-drawer-menu').fadeOut();
        //  iosスクロール許可(スクロール停止を停止)
        $('body').css('overflow','');
        window.removeEventListener( 'touchmove' , move, { passive: false } );
      });
    }
  });
  /* リンク以外をクリックしたら、ドロワーを閉じる */
  $(window).on('load resize', function() {
    let wdw = $(this).width();

    if( wdw < 768 ) {
      // $('.p-drawer-menu').addClass('click-close');
      $('.click-close').on('click', function() {
        $('.js-hamburger').attr('aria-expanded', false);
        $('.js-drawer-menu.click-close').fadeOut();
        // スクロール停止の処理リセット
        $('body').css('overflow','unset');
        window.removeEventListener( 'touchmove' , move , { passive: false } );
      });
    } else {
      $('.js-drawer-menu').removeClass('click-close');
    }
  });

  // スムーススクロール (絶対パスのリンク先が現在のページであった場合でも作動)
  $(document).on('click', 'a[href*="#"]', function () {
    let time = 400;
    let header = $('header').innerHeight();
    let target = $(this.hash);
    if (!target.length) return;
    let targetY = target.offset().top - header;
    $('html,body').animate({ scrollTop: targetY }, time, 'swing');
    return false;
  });



});
