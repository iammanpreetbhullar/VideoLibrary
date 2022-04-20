import React from 'react';
import MovieModal from './components/movieModal'
import './App.css';
import noImage from './images/no-image.png'
import loader from './images/media2.gif'
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import $ from 'jquery';
const BASE_URL = 'http://192.168.1.8:9125';
//import { post } from '../../server/app';

let playPath = "";
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            DbMovieList: [],
            movieListClone: [],
            moviePoster: "",
            movieTitle: "",
            myMovie: "",
            modalHidden: true,
            currentMovie: {},
            show: false,
            mainDivHidden: false,
            movieFilePath: "",
            videoPlayerHidden: true,
            movieDetails: "",
            category: false,
            categories: [
                'English',
                'Hindi',
                'Punjabi'
            ],
            movieFolderArray: [],
            movieByNameArray: [],
            movieDir: "",
            selectedCategory: "",
            extension: "",
            BASE_DIR: ""
        }
    }

    componentDidMount = async () => {
        // this.startHTTPServer();
        this.showLoader();
        //this.listFiles();
        // this.updateList()

        // this.queryMovie();

    }

    startHTTPServer = async () => {
        try {
            const resp = await fetch(`${BASE_URL}/startHttpServer`);
            const data = await resp.json();
            console.log(data);
        } catch (error) {
            console.log(error)
        }
    }

    showLoader = () => {
        $("#loader").toggle();
    }

    hideLoader = () => {
        $('#loader').hide();
    }

    listMovies = async (category) => {
        this.showLoader();
        this.setState({ movieDir: category });
        const { DbMovieList, movieFolderArray, movieListClone } = this.state;
        let movieNameArray = [];
        let newObj = {};
        let nonExist = [];


        await this.fetchDirFolders(category)
            .then(async () => {
                await Promise.all(movieFolderArray.map(async itm => {
                    let movie = itm.movie;
                    if (movie != 'web.config') {
                        let mName = movie.slice(0, movie.length - 7);
                        let mYear = movie.slice(movie.length - 4);
                        await this.queryMovieByName(mName, category)
                            .then((resp) => {
                                console.log(resp)
                                if (resp.length == 0) {
                                    nonExist.push({ "movieName": mName, "year": mYear });
                                }
                                else {
                                    movieListClone.push(resp)
                                }
                            })
                    }
                }))
            })
            .then(async () => {
                if (nonExist.length > 0) {
                    await Promise.all(nonExist.map(async j => {
                        console.log(j)
                        let data = {};
                        data.name = j.movieName;
                        data.year = j.year;
                        await this.fetchMovieDetailsAPI(data)
                            .then(async () => {
                                const { movieDetails } = this.state;
                                console.log(movieDetails);
                                if (movieDetails !== undefined) {
                                    if (movieDetails !== 'error') {
                                        await this.updateMovieDb(movieDetails, category).then(async (response) => {
                                            if (response !== false) {
                                                await this.queryMovie(category);
                                            }
                                        })
                                    } else {
                                        await this.queryMovie(category);
                                    }
                                }
                            })
                    }))

                }
                this.hideLoader();
            })
        // .then(async () => {
        //     await fetch(`${BASE_URL}/endDbSession`)
        //         .then(res => res.json())
        //         .then(res => {
        //             console.log(res)
        //         })
        // })
    }


    fetchMovieDetailsAPI = async (movie) => {
        const baseURL = "https://data-imdb1.p.rapidapi.com/titles/search/title/";
        await fetch(`${baseURL}${movie.name}?info=mini_info&limit=50&page=1&titleType=movie&year=${movie.year}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
                "x-rapidapi-key": "2df8caced5msh14040f60a51c6f7p12f27ajsn5f6c17ccb7d6"
            }
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                let resp = data.results.find((item) => item.titleText.text === movie.name);
                this.setState({ movieDetails: resp })
                console.log(resp)
            })
            .catch(err => {
                this.setState({ movieDetails: 'error' })
            })
    }

    updateMovieDb = async (movieDetails, category) => {
        let theHeaders = new Headers();
        theHeaders.append("Content-Type", "application/json");

        let rawData = JSON.stringify({
            "details": movieDetails,
            "genre": category
        })
        let params = {
            method: 'POST',
            headers: theHeaders,
            body: rawData,

        }
        try {
            const resp = await fetch(`${BASE_URL}/updateMovieDb`, params);
            const data = await resp.json();
            console.log(data)
            return data.acknowledged;

        } catch (error) {
            console.log(error)
        }

    }


    fetchDirFolders = async (category) => {
        const { movieFolderArray } = this.state;
        let theHeaders = new Headers();
        theHeaders.append("Content-Type", "application/json");

        let rawData = JSON.stringify({
            "dir": category
        })
        let params = {
            method: 'POST',
            headers: theHeaders,
            body: rawData,

        }
        try {
            const resp = await fetch(`${BASE_URL}/library/`, params);
            const data = await resp.json();
            await Promise.all(data.map(itm => {
                movieFolderArray.push(itm)
            }));

        } catch (error) {
            console.log(error)
        }

    }

    queryMovieByName = async (movieName, category) => {
        const { movieByNameArray } = this.state;
        let theHeaders = new Headers();
        theHeaders.append("Content-Type", "application/json");

        let rawData = JSON.stringify({
            "title": movieName,
            "genre": category
        })
        let params = {
            method: 'POST',
            headers: theHeaders,
            body: rawData,

        }
        try {
            const resp = await fetch(`${BASE_URL}/queryMovieByName/`, params);
            const data = await resp.json();
            return data;
            // console.log(data);
            // await Promise.all(data.map(itm => {
            //     let releaseDate = itm.releaseDate.slice(itm.releaseDate.length - 4);                
            //     movieByNameArray.push({movieTitle: itm.title, movieYear : releaseDate})
            // }));

        } catch (error) {
            console.log(error)
        }
    }

    queryMovie = async (category) => {
        const { DbMovieList } = this.state;
        try {
            const response = await fetch(`${BASE_URL}/queryMovie?category=${category}`);
            const data = await response.json();
            await Promise.all(data.map(item => {
                DbMovieList.push(item)
            }))
        } catch (error) {
            console.log(error)
        }
        this.updateList();
    }

    updateList = () => {
        //this.showLoader();
        setTimeout(() => {
            const { DbMovieList } = this.state;
            this.setState({ movieListClone: DbMovieList })
        }, 2000);


    }

    myfunc = async (detail) => {
        const { movieDir, BASE_DIR } = this.state;
        this.setState({ modalHidden: false })
        this.setState({ currentMovie: detail, show: true })
        let dirName = detail[0].title;
        let releaseYear = (detail[0].releaseDate).slice(detail[0].releaseDate.length - 4);
        let myHeaders = new Headers();
        const BASE_PATH = "http://192.168.1.8:9110";
        //const BASE_PATH = "http://localhost:8080";
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "dirName": dirName,
            "releaseYear": releaseYear,
            "path": movieDir
        });
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        try {
            const resp = await fetch(`${BASE_URL}/filepath`, requestOptions);
            const data = await resp.json()
                .then((data) => {

                    if (data != "not supported") {
                        let fullMoviePath = `${BASE_PATH}/${BASE_DIR}/${dirName} - ${releaseYear}/${data.file}`
                        let fileExtension = data.file.slice(data.file.length - 3);
                        this.setState({ extension: `video/${fileExtension}` });
                        let newPath = encodeURI(fullMoviePath.trim());
                        setTimeout(() => {
                            this.setState({ movieFilePath: newPath, extension: `video/${fileExtension}` })
                        }, 700);

                    } else if (data == "not supported") {
                        this.setState({ movieFilePath: "unsupported" })
                    }
                })

        } catch (error) {
            console.log(error);
        }
    }

    playMovie = () => {
        console.log(playPath)
        setTimeout(() => {

            this.setState({ videoPlayerHidden: false })
        }, 1000);
    }

    openMovieModal = (e) => {
        let movie = e.target.value;
    }

    handleClose = () => {
        this.setState({ show: false })
        this.setState({ movieFilePath: "" })
        // this.setState({ mainDivHidden: false })
    }

    handleCategory = async (category) => {
        await this.listMovies(category);
        this.setState({ category: true, BASE_DIR: category });
    }

    goBack = () => {
        this.setState({ category: false, selectedCategory: "" });
        this.setState({ movieListClone: [], DbMovieList: [], dirFolders: [], movieFolderArray: [] })
    }


    render() {
        const { movieFilePath, movieListClone } = this.state;
        return (
            <div className='mainDiv'>
                <div className='headingDiv'>
                    <button className='btn1' onClick={this.goBack}><i className="fa fa-arrow-circle-left"></i></button>
                    <h1 className='heading' onClick={this.goBack}>Homeflix</h1>
                </div>
                {this.state.category !== true ?
                    <div>
                        <div className='categories' onClick={this.testClick}>Categories</div>
                        <div className='categoryParent'>
                            {this.state.categories.map((cate, idx) => {
                                return (
                                    <li key={idx} className='category' onClick={() => this.handleCategory(cate)}>{cate}</li>
                                )
                            })}
                        </div>
                    </div> :

                    <div hidden={this.state.mainDivHidden}>
                        {/* <div className='movieList' ></div> */}
                        {/* <button onClick={this.updateList}>click me</button> */}
                        <div className='movieList'>
                            {movieListClone.map((item, idx) => {
                                let releaseYear = item[0].releaseDate.slice(item[0].releaseDate.length - 4);
                                let movieName = item[0].title + " (" + releaseYear + ")";
                                return (
                                    <li key={idx} onClick={() => this.myfunc(item)}>
                                        <img alt='poster' src={item[0].imageUrl} width='150px'></img>
                                        <h2>{movieName}</h2>
                                    </li>
                                    // <button key={idx} onClick={(idx) => this.openMovieModal(idx)} value={item.item} style={{ marginTop: "10px", display: "flex" }}>{item.item}</button>
                                )
                            })}
                        </div>
                        {movieFilePath.length > 0 ?
                            <Modal size='lg' centered show={this.state.show} onHide={this.handleClose} backdrop="static"
                                keyboard={false}>
                                <Modal.Header closeButton>
                                    {/* {this.props.details.titleText.text} */}
                                </Modal.Header>
                                <Modal.Body>
                                    {this.state.movieFilePath != "unsupported" ?
                                        <video className='video-js' width='100%' height='100%' controls>
                                            <source src={movieFilePath} type="video/mp4"></source>
                                        </video>

                                        : <div className='unsupportedDiv'>
                                            <h2>Video format not supported</h2>
                                        </div>
                                    }
                                    {/* <ReactPlayer url={this.state.playMovie} width="100%" height="100%" controls={true} type="video/x-matroska" /> */}

                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={this.handleClose}>
                                        Close
                                    </Button>
                                    {/* <Button variant="primary" onClick={this.playMovie}>
                                Play Movie
                            </Button> */}
                                </Modal.Footer>
                            </Modal>
                            : null
                            // <div style={{ color: '#fff', fontSize: '50px', textAlign: 'center', marginTop: '100px' }}>No movies in this category</div>
                        }
                    </div>
                }
                <div className='loaderParent'>
                    <div id="loader" >
                        <img alt='loader' src={loader} />
                    </div>
                </div>
            </div>
        )
    }

}

export default App;