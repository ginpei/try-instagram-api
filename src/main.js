let $ = window.gQuery;

function jsonp(url, callback) {
	let callbackId = `callback_${Date.now()}`;

	window[callbackId] = (data)=>{
		document.body.removeChild(elScript);
		delete window[callbackId];

		callback(data);
	};

	let elScript = document.createElement('script');
	elScript.src = url + `&callback=${callbackId}`;
	document.body.appendChild(elScript);
}

class Controller {
	/**
	 * Start app.
	 */
	start() {
		this.initAccessToken();
		this.delegateEvents();

		this.update();
	}

	/**
	 * Initialize access token.
	 */
	initAccessToken() {
		if (location.hash.indexOf('#access_token=') === 0) {
			let token = location.hash.slice('#access_token='.length);
			this.updateAccessToken(token);
		}

		var matched = document.cookie.match(/(?:^|;\s*)accessToken=(.*)(?:;|$)/);
		if (matched) {
			this.accessToken = matched[1];
		}
	}

	/**
	 * @param {string} token
	 */
	updateAccessToken(token) {
		document.cookie = `accessToken=${token}`;
	}

	/**
	 * Set event handlers.
	 */
	delegateEvents() {
		let events = {
			login: 'click',
			getMyself: 'click',
			getRecents: 'click',
		};

		for (let name in events) {
			let $el = $(`.js-${name}`);
			let type = events[name];
			let callbackName = `\$${name}_on${type}`;
			$el.on(type, this[callbackName].bind(this));
		}
	}

	/**
	 * Update elements on the page.
	 */
	update() {
		$('.js-login').prop('disabled', false);
		$('.js-getMyself').prop('disabled', !this.accessToken);
		$('.js-getRecents').prop('disabled', !this.user);
	}

	/**
	 * Direct the user to log in page of Instagram.
	 * @see https://www.instagram.com/developer/authentication/
	 */
	login() {
		// At "Manage Clients" https://www.instagram.com/developer/clients/manage/
		// Edit -> Security -> Turn off "Disable implicit OAuth"
		//

		let redirectUri = encodeURIComponent(location.href);
		let url = `https://api.instagram.com/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token`;

		location.href = url;
	}

	/**
	 * Get user's information.
	 */
	getMyself() {
		let url = `https://api.instagram.com/v1/users/self/?access_token=${this.accessToken}`;
		jsonp(url, (response)=>{
			let data = response.data;
			let text = `${data.full_name} @${data.username} #${data.id}`;
			$('.js-user').text(text);

			this.user = data;
			this.update();
		});
	}

	/**
	 * Get user's recent photos and show them.
	 */
	getRecents() {
		let url = `https://api.instagram.com/v1/users/${this.user.id}/media/recent/?access_token=${this.accessToken}`;
		jsonp(url, (response)=>{
			let data = response.data;
			this.renderPhotos(data);
		});
	}

	/**
	 * Show photos.
	 * @param {Array} photoDataList
	 */
	renderPhotos(photoDataList) {
		let html = '';
		photoDataList.forEach((source)=>{
			let image = source.images.thumbnail;

			let {width, height} = image;
			let src = image.url;
			let link = source.link;
			let data = {
				height: image.height,
				link: source.link,
				src: image.url,
				width: image.width,
			};

			html += this.buildPhotoHtml(data);
		});

		$('.js-recents').html(html);
	}

	buildPhotoHtml(data) {
		let template = $('#template-photo').prop('text');
		let html = template.replace(/\${(.+?)}/g, (m0, m1)=>data[m1]);
		return html;
	}

	$login_onclick(event) {
		this.login();
	}

	$getMyself_onclick(event) {
		this.getMyself();
	}

	$getRecents_onclick(event) {
		this.getRecents();
	}
}

let controller = new Controller();
controller.start();
