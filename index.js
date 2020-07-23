var COMMENTID = 0

var posts = new Database('posts')

function displayAllPosts() {
	var allPosts = posts.getAll()
	allPosts.sort(function (post1, post2) {
		if (post1.date.getYear() > post2.date.getYear()) {
			return 1
		} else if (post1.date.getYear() === post2.date.getYear()) {
			if (post1.date.getMonth() > post2.date.getMonth()) {
				return 1
			} else if (post1.date.getMonth() === post2.date.getMonth()) {
				if (post1.date.getDate() > post2.date.getDate()) {
					return 1
				} else if (post1.date.getDate() === post2.date.getDate()) {
					var sum1 = post1.likes.length + post1.comments.length
					var sum2 = post2.likes.length + post2.comments.length

					return sum1 - sum2
				}
			}
		}
		return -1
	})
	for (let post of allPosts) {
		var elem = createPost(post)
		addNewPost(elem)
		for (let comment of post.comments || []) {
			addNewComment(createComment(comment, post.id), post.id)
		}
		for (let like of post.likes || []) {
			addNewLike(post)
		}
	}
	// ეს ხაზი აუცილებელია news feed ტესტერისთვის
	return allPosts
}

displayAllPosts()

function newPost() {
	var post = posts.create({
		text: getPostText(),
		user: getUser(),
		date: new Date(),
		likes: [],
		comments: []
	})
	if (post.text.length !== 0) {
		var elem = createPost(post)
		addNewPost(elem)
	}
}

function getCommentId() {
	return ++COMMENTID
}

function getPostText() {
	var postInputElement = document.getElementById('post_text')
	return postInputElement.value
}

function getUser() {
	return localStorage.getItem('currentUser') || 'unknown user'
}

function setUser(username) {
	localStorage.setItem('currentUser', username)
	document.getElementById('username').value = username
}

function deletePost(postId) {
	var postElem = document.getElementById(`post-${postId}`)
	postElem.parentNode.removeChild(postElem)
	posts.delete(postId)
}

function createPost(post) {
	return `
		<div id="post-${post.id}" class="post container">
			<div>
				<button class="post_delete_button" onclick="deletePost(${post.id})">
					delete
				</button>
			</div>
			<div class="post_title">
				${post.user}
			</div>
			<div class="post_text">
				${post.text}
			</div>
			${createPostLikes(post)}
			<div class="comments_container">
				<textarea class="comment_input_text"></textarea>
				<button class="new_comment" onclick="newComment(${post.id})">
					add comment
				</button>
				<div class="comments_feed">
				</div>
			</div>
			<div class="post_date">
				${post.date.getDate()}
			</div>
		</div>
	`
}

function createComment(comment) {
	return `<div class="comment_container" id="comment_container_${comment.id}">
		<div class="comment_text">
			${comment.text}
		</div>
		<button class="delete_comment" onclick="deleteComment(${comment.id}, ${comment.postId})">
			Delete Comment
		</button>
	</div>`
}

function deleteComment(commentId, postId) {
	deleteCommentFromHtml(commentId)
	deleteCommentFromDatabase(commentId, postId)
}

function deleteCommentFromHtml(commentId) {
	var commentElem = document.getElementById("comment_container_" + commentId)
	commentElem.remove()
}

function deleteCommentFromDatabase(commentId, postId) {
	var post = posts.getById(postId)
	for (let i in post.comments) {
		if (post.comments[i].id === commentId) {
			post.comments.splice(i, 1)
		}
	}
	posts.update(post)
}

function newComment(postId) {
	var postElem = document.getElementById(`post-${postId}`)
	var comment_input = postElem.querySelector('textarea.comment_input_text')
	var comment = {
		text: comment_input.value,
		id: getCommentId(),
		postId: postId
	}
	var post = posts.getById(postId)
	post.comments.push(comment)
	addNewComment(createComment(comment), postId)

	posts.update(post)
}

function addNewComment(elem, postId) {
	var postElem = document.getElementById(`post-${postId}`)
	var postComments = postElem.querySelector('div.comments_feed')
	var commentContainer = document.createElement('div')
	commentContainer.innerHTML = elem
	postComments.insertAdjacentElement('afterbegin', commentContainer)
}

function createPostLikes(post) {
	return `
		<div class="post_likes_container">
			<div class="post_likes_info">
				<span class="post_likes_count">
				</span>
				<span class="post_likes_text">
				</span>
			</div>
			<button class="post_like_button" onclick="newLike(${post.id})">
				like
			</button>
		</div>
	`
}

function newLike(postId) {
	var post = posts.getById(postId)
	var user = getUser()
	if (post.likes.includes(user)) {
		removeUserLike(post, user)
	} else {
		post.likes.push(user)
	}
	addNewLike(post)
	posts.update(post)
}

function removeUserLike(post, user) {
	for (var i in post.likes) {
		if (post.likes[i] == user) {
			post.likes.splice(i, 1)
		}
	}
}

function addNewLike(post) {
	var postElem = document.getElementById(`post-${post.id}`)
	var postLikes = postElem.querySelector('div.post_likes_info')
	var postLikesCountElem = postLikes.querySelector('span.post_likes_count')
	var postLikesCount = postLikesCountElem.innerHTML
	var postLikesInfoElem = postLikes.querySelector('span.post_likes_text')
	if (post.likes.length !== 0) {
		postLikesCountElem.innerText = post.likes.length
		postLikesInfoElem.innerHTML = "likes"
	} else {
		postLikesCountElem.innerText = ""
		postLikesInfoElem.innerHTML = ""
	}
}

function addNewPost(elem) {
	var posts = document.getElementById('posts')
	var post = document.createElement('div')
	var check = document.getElementById("post_text")
	post.innerHTML = elem
	posts.insertAdjacentElement('afterbegin', post)
	document.getElementById("post_text").value = ""
}

function showTestResults() {
	var tests = document.getElementById("tests");
	tests.style.display = "block";
	var openButton = document.getElementById("open");
	openButton.style.display = "none"
	var closeButton = document.getElementById('close')
	closeButton.style.display = "block";
}

function hideTestResults() {
	var tests = document.getElementById("tests");
	tests.style.display = "none";
	var openButton = document.getElementById("open");
	openButton.style.display = "block"
	var closeButton = document.getElementById('close')
	closeButton.style.display = "none";
}