import React from 'react';

class Posts extends React.Component {
    constructor() {
        super();
        this.state = {
            currentPage: 1,
            postsPerPage: 3,
            upperPageBound: 3,
            lowerPageBound: 0,
            isPrevBtnActive: 'disabled',
            isNextBtnActive: '',
            pageBound: 3,
        };
        this.handleClick = this.handleClick.bind(this);
        this.btnDecrementClick = this.btnDecrementClick.bind(this);
        this.btnIncrementClick = this.btnIncrementClick.bind(this);
        this.btnNextClick = this.btnNextClick.bind(this);
        this.btnPrevClick = this.btnPrevClick.bind(this);
        this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
    }
    handleClick(event) {
        let listid = Number(event.target.id);
        this.setState({
            currentPage: listid
        });
        this.setPrevAndNextBtnClass(listid);
    }
    setPrevAndNextBtnClass(listid) {
        let totalPage = Math.ceil(this.props.posts && this.props.posts.length / this.state.postsPerPage);
        this.setState({ isNextBtnActive: 'disabled' });
        this.setState({ isPrevBtnActive: 'disabled' });
        if (totalPage === listid && totalPage > 1) {
            this.setState({ isPrevBtnActive: '' });
        }
        else if (listid === 1 && totalPage > 1) {
            this.setState({ isNextBtnActive: '' });
        }
        else if (totalPage > 1) {
            this.setState({ isNextBtnActive: '' });
            this.setState({ isPrevBtnActive: '' });
        }
    }
    btnIncrementClick() {
        this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound });
        this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound });
        let listid = this.state.upperPageBound + 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    btnDecrementClick() {
        this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound });
        this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound });
        let listid = this.state.upperPageBound - this.state.pageBound;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    btnPrevClick() {
        if ((this.state.currentPage - 1) % this.state.pageBound === 0) {
            this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound });
            this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound });
        }
        let listid = this.state.currentPage - 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    btnNextClick() {
        if ((this.state.currentPage + 1) > this.state.upperPageBound) {
            this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound });
            this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound });
        }
        let listid = this.state.currentPage + 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    render() {
        const { currentPage, postsPerPage, upperPageBound, lowerPageBound, isPrevBtnActive, isNextBtnActive } = this.state;
        const indexOfLastTodo = currentPage * postsPerPage;
        const indexOfFirstTodo = indexOfLastTodo - postsPerPage;
        const currentTodos = this.props.posts && this.props.posts.slice(indexOfFirstTodo, indexOfLastTodo);
        const link = window.location.hostname;
        const renderTodos = currentTodos && currentTodos.map((post, index) => {
            return (
                <div className={`card text-center ${post.postID}`} key={index} >
                    <div className="card-header">
                        <h5 className={post.postID}>Slug <span className="uinfo">{post.slug}</span></h5>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">
                            Initial Url: <a href={`${post.url}`} target="_blank" rel="noopener noreferrer" > {post.url} </a>
                        </h5>
                        <h5>
                            New Url: <a href={`${post.slug}/url`} target="_blank" rel="noopener noreferrer" className={post.postID}> {`${link}/${post.slug}/url`} </a>
                        </h5>
                    </div>
                    <div className="card-footer text-muted">
                        Created at: {post.date}
                    </div>
                </div>
            )
        });

        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(this.props.posts && this.props.posts.length / postsPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers && pageNumbers.map(number => {
            if (number === 1 && currentPage === 1) {
                return (
                    <li key={number} className='active' id={number}><button className="btn btn-dark" id={number} onClick={this.handleClick}>{number}</button></li>
                )
            }
            else if ((number < upperPageBound + 1) && number > lowerPageBound) {
                return (
                    <li key={number} id={number}><button className="btn btn-dark" id={number} onClick={this.handleClick}>{number}</button></li>
                )
            }
            return null;
        });

        let pageIncrementBtn = null;
        if (pageNumbers.length > upperPageBound) {
            pageIncrementBtn = <li className=''><button className="btn btn-primary" onClick={this.btnIncrementClick}> &hellip; </button></li>
        }
        let pageDecrementBtn = null;
        if (lowerPageBound >= 1) {
            pageDecrementBtn = <li className=''><button className="btn btn-primary" onClick={this.btnDecrementClick}> &hellip; </button></li>
        }
        let renderPrevBtn = null;
        if (isPrevBtnActive === 'disabled') {
            renderPrevBtn = <li className={isPrevBtnActive}><button className="btn btn-primary" id="btnPrev"> Prev </button></li>
        }
        else {
            renderPrevBtn = <li className={isPrevBtnActive}><button className="btn btn-primary" id="btnPrev" onClick={this.btnPrevClick}> Prev </button></li>
        }
        let renderNextBtn = null;
        if (isNextBtnActive === 'disabled') {
            renderNextBtn = <li className={isNextBtnActive}><button className="btn btn-primary" id="btnNext"> Next </button></li>
        }
        else {
            renderNextBtn = <li className={isNextBtnActive}><button className="btn btn-primary" id="btnNext" onClick={this.btnNextClick}> Next </button></li>
        }
        return (
            <div>
                <ul>
                    {
                        renderTodos && renderTodos.length !== 0 ?
                            renderTodos
                            :
                            <div className="card">
                                <div className="card-body">
                                    No urls on this page.
                                </div>
                            </div>
                    }
                </ul>
                {
                    this.props.posts && this.props.posts.length <= 3 ?
                        <ul id="page-numbers" className="pagination">
                            {renderPageNumbers}
                        </ul>
                        :
                        <ul id="page-numbers" className="pagination">
                            {renderPrevBtn}
                            {pageDecrementBtn}
                            {renderPageNumbers}
                            {pageIncrementBtn}
                            {renderNextBtn}
                        </ul>
                }
            </div>
        );
    }
}



export default Posts
