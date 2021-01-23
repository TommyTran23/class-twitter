function createTweetBox(event) {
    $(".tweetform").replaceWith(`<form>
    <label for="tweetToSend" class="title is-2">Send a Tweet!</label>
    <textarea id="tweetToSend" name="tweetToSend" class="textarea" placeholder="What's Happening?"></textarea>
    <br>
    <input type="submit" value="Tweet" class="button is-link is-rounded sendyourTweet">
    <br><br>
</form>`)
    loadPrettyTweets();
}

async function getTweets() {
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });
    return result.data;
}

async function sendTweet(event) {
    event.preventDefault();
    let yourtweet = $('#tweetToSend').val();
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            body: yourtweet
        },
    });
    console.log(yourtweet)
    loadPrettyTweets();
}

async function getSpecificTweet(tweetID) {
    const result = await axios({
        method: 'get',
        url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetID}`,
        withCredentials: true,
    });
    return result.data;
}

async function loadPrettyTweets() {
    let allTweets = await getTweets();
    let tweetHTML = ''

    for (let i = 0; i < allTweets.length; i++) {
        if (allTweets[i].isMine) {
            if (allTweets[i].type == "retweet") {
                tweetHTML += loadMyRetweet(allTweets[i]);
            } else {
                let myTweet = loadMyTweet(allTweets[i]);
                tweetHTML += myTweet;
            }

        } else if (allTweets[i].type == "retweet") {
            if (allTweets[i].isLiked) {
                tweetHTML += loadLikedRetweet(allTweets[i]);
            } else {
                tweetHTML += loadRetweet(allTweets[i]);
            }
        } else if (allTweets[i].isLiked) {
            tweetHTML += loadLikedTweet(allTweets[i]);
        } else {
            tweetHTML += loadNormalTweet(allTweets[i]);
        }
    }
    $('#tweets').html(tweetHTML);
    $(".likeTweet").on('click', likeTweet);
    $(".retweetButton").on('click', retweetTweet);
    $(".tweetform").on('click', createTweetBox);
    $(".sendyourTweet").on('click', sendTweet);
    $(".deleteMyTweet").on('click', deleteMyTweet);
    $(".editMyTweet").on('click', editTweet);
    $(".commentOnTweet").on('click', commentTweet);
    $(".box").on('click', commentedTweet);
    $(".resetPage").on('click', loadPrettyTweets);
    $(".deleteNotif").on('click', hideNotification);

    // prevent buttons from being registered in .box
    $(".likeTweet").click(function (event) {
        event.stopPropagation();
    });
    $(".retweetButton").click(function (event) {
        event.stopPropagation();
    });
    $(".commentOnTweet").click(function (event) {
        event.stopPropagation();
    });
    $(".editMyTweet").click(function (event) {
        event.stopPropagation();
    });
    $(".deleteMyTweet").click(function (event) {
        event.stopPropagation();
    });
    $(".textarea").click(function (event) {
        event.stopPropagation();
    });
    $(".retweetToSend").click(function (event) {
        event.stopPropagation();
    });
}

// delete notification
function hideNotification(event) {
    $('.noteforComments').hide()
}

// functionalities for loading your own tweet
function loadMyTweet(myTweet) {
    let finalTweet = `<div class="box has-background-primary-light" id="${myTweet.id}">
    <article class="media">
      <div class="media-left">
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>${myTweet.author}</strong>
            <br>
            ${myTweet.body}
            <br>
            <div class="${myTweet.isLiked} ${myTweet.isMine}">
            <button class="button is-small commentOnTweet">💭</button> Comments: ${myTweet.replyCount} <button class="button is-small retweetButton">🔗</button> Retweets: ${myTweet.retweetCount} <button class="button is-small likeTweet">💖</button> Likes: ${myTweet.likeCount}
            <br>
            <button class="button is-small editMyTweet">🖊️</button> Edit <button class="button is-small deleteMyTweet">❌</button> Delete Tweet
            </div>
          </p>
        </div>
      </div>
    </article>
</div>`
    return finalTweet;
}

function loadMyRetweet(myTweet) {
    let finalTweet = `<div class="box has-background-primary-light" id="${myTweet.id}">
    <article class="media">
      <div class="media-left">
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>${myTweet.author}</strong> 🔁 Retweeted
            <br>
            ${myTweet.body}
            <br>
            <div class="${myTweet.isLiked} ${myTweet.isMine}">
            <button class="button is-small commentOnTweet">💭</button> Comments: ${myTweet.replyCount} <button class="button is-small retweetButton">🔗</button> Retweets: ${myTweet.retweetCount} <button class="button is-small likeTweet">💖</button> Likes: ${myTweet.likeCount}
            <br>
            <button class="button is-small editMyTweet">🖊️</button> Edit <button class="button is-small deleteMyTweet">❌</button> Delete Tweet
            </div>
          </p>
        </div>
      </div>
    </article>
</div>`
    return finalTweet;
}

async function deleteMyTweet(event) {
    let idOfTweet = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    const result = await axios({
        method: 'delete',
        url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${idOfTweet}`,
        withCredentials: true,
    });
    loadPrettyTweets();
}

async function editTweet(event) {
    let idOfTweet = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    let tweetToEdit = await getSpecificTweet(idOfTweet);
    $(`#${idOfTweet}`).append(`<br><form>
    <textarea id="editTweet${idOfTweet}" name="tweetEdit" class="textarea">${tweetToEdit.body}</textarea>
    <br>
    <input type="submit" value="Edit" class="button is-link is-rounded editTweet">
    <br><br>
</form>`)

    $('.editTweet').on('click', sendEditTweet);

    $(".textarea").click(function (event) {
        event.stopPropagation();
    });
    $(".editTweet").click(function (event) {
        event.stopPropagation();
    });
}

async function sendEditTweet(event) {
    let tweetID = event.target.parentElement.parentElement.id;
    let tweetBody = $(`#editTweet${tweetID}`).val()
    event.preventDefault();
    const result = await axios({
        method: 'put',
        url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetID}`,
        withCredentials: true,
        data: {
            body: tweetBody
        },
    });
    loadPrettyTweets();
}

// loading everyone else's tweets that are liked and unliked
function loadNormalTweet(normalTweet) {
    let finalNormalTweet = `<div class="box" id="${normalTweet.id}">
    <article class="media">
      <div class="media-left">
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>${normalTweet.author}</strong>
            <br>
            ${normalTweet.body}
            <br>
            <div class="${normalTweet.isLiked} ${normalTweet.isMine}">
            <button class="button is-small commentOnTweet">💭</button> Comments: ${normalTweet.replyCount} <button class="button is-small retweetButton">🔗</button> Retweets: ${normalTweet.retweetCount} <button class="button is-small likeTweet">💖</button> Likes: ${normalTweet.likeCount}
            </div>
          </p>
        </div>
      </div>
    </article>
</div>`
    return finalNormalTweet;
}

function loadLikedTweet(likedTweet) {
    let finalLikedTweet = `<div class="box" id="${likedTweet.id}">
    <article class="media">
      <div class="media-left">
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>${likedTweet.author}</strong>
            <br>
            ${likedTweet.body}
            <br>
            <div class="${likedTweet.isLiked} ${likedTweet.isMine}">
            <button class="button is-small commentOnTweet">💭</button> Comments: ${likedTweet.replyCount} <button class="button is-small retweetButton">🔗</button> Retweets: ${likedTweet.retweetCount} <button class="button is-small is-link likeTweet">💖</button> Likes: ${likedTweet.likeCount}
            </div>
          </p>
        </div>
      </div>
    </article>
</div>`
    return finalLikedTweet;
}

// functions to create designs for retweets
function loadLikedRetweet(likedTweet) {
    let finalLikedTweet = `<div class="box" id="${likedTweet.id}">
    <article class="media">
      <div class="media-left">
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>${likedTweet.author}</strong> 🔁 Retweeted
            <br>
            ${likedTweet.body}
            <br>
            <div class="${likedTweet.isLiked} ${likedTweet.isMine}">
            <button class="button is-small commentOnTweet">💭</button> Comments: ${likedTweet.replyCount} <button class="button is-small retweetButton">🔗</button> Retweets: ${likedTweet.retweetCount} <button class="button is-small is-link likeTweet">💖</button> Likes: ${likedTweet.likeCount}
            </div>
          </p>
        </div>
      </div>
    </article>
</div>`
    return finalLikedTweet;
}

function loadRetweet(likedTweet) {
    let finalLikedTweet = `<div class="box" id="${likedTweet.id}">
    <article class="media">
      <div class="media-left">
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>${likedTweet.author}</strong> 🔁 Retweeted
            <br>
            ${likedTweet.body}
            <br>
            <div class="${likedTweet.isLiked} ${likedTweet.isMine}">
            <button class="button is-small commentOnTweet">💭</button> Comments: ${likedTweet.replyCount} <button class="button is-small retweetButton">🔗</button> Retweets: ${likedTweet.retweetCount} <button class="button is-small likeTweet">💖</button> Likes: ${likedTweet.likeCount}
            </div>
          </p>
        </div>
      </div>
    </article>
</div>`
    return finalLikedTweet;
}

async function likeTweet(event) {
    let idOfTweet = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    let metaData = event.target.parentNode.className;
    metaData = metaData.split(" ");
    let isLiked = (metaData[0] == 'true');

    if (isLiked) {
        const result = await axios({
            method: 'put',
            url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${idOfTweet}/unlike`,
            withCredentials: true,
        });

    } else {
        const result = await axios({
            method: 'put',
            url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${idOfTweet}/like`,
            withCredentials: true,
        });

    }
    loadPrettyTweets();
}

async function retweetTweet(event) {
    let idOfTweet = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    let tweetToRetweet = await getSpecificTweet(idOfTweet);
    $(`#${idOfTweet}`).append(`<br><form>
    <textarea id="retweetToSend${idOfTweet}" name="retweetform" class="textarea">${tweetToRetweet.body}</textarea>
    <br>
    <input type="submit" value="Retweet" class="button is-link is-rounded retweetToSend">
    <br><br>
</form>`)

    $('.retweetToSend').on('click', sendRetweet);

    $(".textarea").click(function (event) {
        event.stopPropagation();
    });
    $(".retweetToSend").click(function (event) {
        event.stopPropagation();
    });
    console.log(tweetToRetweet);
}

async function sendRetweet(event) {
    event.preventDefault();
    let tweetID = event.target.parentElement.parentElement.id;
    let tweetBody = $(`#retweetToSend${tweetID}`).val()
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "retweet",
            "parent": tweetID,
            "body": tweetBody
        },
    });
    loadPrettyTweets();
}

// generate tweet with comments when clicked
async function commentedTweet(event) {
    let tweetToLoad = event.currentTarget.id;
    let thetweet = await getSpecificTweet(tweetToLoad);
    let tweetHTML = '';

    if (thetweet.isMine) {
        if (thetweet.type == "retweet") {
            tweetHTML += loadMyRetweet(thetweet);
        } else {
            let myTweet = loadMyTweet(thetweet);
            tweetHTML += myTweet;
        }
    } else if (thetweet.type == "retweet") {
        if (thetweet.isLiked) {
            tweetHTML += loadLikedRetweet(thetweet);
        } else {
            tweetHTML += loadRetweet(thetweet);
        }
    } else if (thetweet.isLiked) {
        tweetHTML += loadLikedTweet(thetweet);
    } else {
        tweetHTML += loadNormalTweet(thetweet);
    }

    if (thetweet.replyCount > 0) {
        for (let i = 0; i < thetweet.replies.length; i++) {
            if (thetweet.replies[i].isMine) {
                let myTweet = loadMyTweet(thetweet.replies[i]);
                tweetHTML += myTweet;
            } else if (thetweet.replies[i].type == "retweet") {
                if (thetweet.replies[i].isLiked) {
                    tweetHTML += loadLikedRetweet(thetweet.replies[i]);
                } else {
                    tweetHTML += loadRetweet(thetweet.replies[i]);
                }
            } else if (thetweet.replies[i].isLiked) {
                tweetHTML += loadLikedTweet(thetweet.replies[i]);
            } else {
                tweetHTML += loadNormalTweet(thetweet.replies[i]);
            }
        }
    }
    $('#tweets').html(tweetHTML);
    $(".likeTweet").on('click', likeTweet);
    $(".retweetButton").on('click', retweetTweet);
    $(".tweetform").on('click', createTweetBox);
    $(".sendyourTweet").on('click', sendTweet);
    $(".deleteMyTweet").on('click', deleteMyTweet);
    $(".editMyTweet").on('click', editTweet);
    $(".commentOnTweet").on('click', commentTweet);
    $(".box").on('click', commentedTweet);
    $(".resetPage").on('click', loadPrettyTweets);

    // prevent buttons from being registered in .box
    $(".likeTweet").click(function (event) {
        event.stopPropagation();
    });
    $(".retweetButton").click(function (event) {
        event.stopPropagation();
    });
    $(".commentOnTweet").click(function (event) {
        event.stopPropagation();
    });
    $(".editMyTweet").click(function (event) {
        event.stopPropagation();
    });
    $(".deleteMyTweet").click(function (event) {
        event.stopPropagation();
    });
    $(".textarea").click(function (event) {
        event.stopPropagation();
    });
    $(".retweetToSend").click(function (event) {
        event.stopPropagation();
    });
}

// send comments to people
async function commentTweet(event) {
    let idOfTweet = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    let tweetToComment = await getSpecificTweet(idOfTweet);
    $(`#${idOfTweet}`).append(`<br><form>
    <textarea id="commentToSend${idOfTweet}" name="commentForm" class="textarea" placeholder="Tweet your Reply"></textarea>
    <br>
    <input type="submit" value="Comment" class="button is-link is-rounded commentToSend">
    <br><br>
</form>`)

    $('.commentToSend').on('click', sendCommentTweet);

    $(".textarea").click(function (event) {
        event.stopPropagation();
    });
    $(".commentToSend").click(function (event) {
        event.stopPropagation();
    });
}

async function sendCommentTweet(event) {
    event.preventDefault();
    let tweetID = event.target.parentElement.parentElement.id;
    let tweetBody = $(`#commentToSend${tweetID}`).val()
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "reply",
            "parent": tweetID,
            "body": tweetBody
        },
    });
    loadPrettyTweets();
}

$(function () {
    loadPrettyTweets();
})