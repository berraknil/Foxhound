// External dependencies
import React from 'react';
import page from 'page';
import classNames from 'classnames';

// Internal dependencies
import API from 'utils/api';
import ContentMixin from 'utils/content-mixin';
import PostsStore from '../../stores/posts-store';

/**
 * Method to retrieve state from Stores
 */
function getState( id ) {
	return {
		data: PostsStore.getPost( id )
	};
}

let SinglePost = React.createClass( {
	mixins: [ ContentMixin ],

	propTypes: {
		slug: React.PropTypes.string.isRequired,
		type: React.PropTypes.oneOf( [ 'post', 'page' ] ),
	},

	getDefaultProps: function(){
		return {
			type: 'post',
		};
	},

	getInitialState: function() {
		return getState( this.props.slug );
	},

	componentDidMount: function() {
		PostsStore.addChangeListener( this._onChange );
		API.getPost( this.props.slug, this.props.type );
	},

	componentDidUpdate: function( prevProps, prevState ) {
		if ( prevProps !== this.props ) {
			API.getPost( this.props.slug, this.props.type );
		}
	},

	componentWillUnmount: function() {
		PostsStore.removeChangeListener( this._onChange );
	},

	_onChange: function() {
		this.setState( getState( this.props.slug ) );
	},

	setTitle: function() {
		let post = this.state.data;
		if ( 'undefined' !== typeof post.title ) {
			document.title = `${post.title.rendered} — ${FoxhoundSettings.title}`;
		}
	},

	close: function( event ) {
		page( '/' );
	},

	renderPlaceholder: function() {
		return null;
	},

	render: function() {
		let post = this.state.data;
		if ( 'undefined' === typeof post.title ) {
			return this.renderPlaceholder();
		}

		this.setTitle();

		let classes = classNames( {
			'entry': true
		} );

		return (
			<div className="card">
				<article id={ `post-${ post.id }` } className={ classes }>
					<h1 className="entry-title" dangerouslySetInnerHTML={ this.getTitle( post ) } />
					<div className="entry-meta"></div>
					<div className="entry-content" dangerouslySetInnerHTML={ this.getContent( post ) } />

					<footer className="entry-meta">
						<div className="entry-meta-item">
							<span className="entry-meta-label">published</span>
							<time className="entry-meta-value entry-date published updated" dateTime={ post.date }>{ this.getDate( post ) }</time>
						</div>
						<div className="entry-meta-item">
							<span className="entry-meta-label">posted in </span>
							<a href="#">stories</a>
							<span className="fancy-amp"> &amp; </span>
							<span className="entry-meta-label">tagged </span>
							<a href="#">test</a>, <a href="#">stories</a>
						</div>
					</footer>
				</article>
			</div>
		);
	}
} );

export default SinglePost;
