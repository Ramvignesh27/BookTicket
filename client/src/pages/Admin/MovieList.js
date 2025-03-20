import React, {useEffect, useState} from 'react';
import { Button, Table } from 'antd';
import MovieForm from "./MovieForm";
import {ShowLoading, HideLoading} from "../../redux/loaderSlice"
import { getAllMovies } from '../../api/movies';
import { useDispatch } from "react-redux";
import moment from "moment";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons"
import DeleteMovieModal from "./DeleteMovieModal";

function MovieList() {
    // const fakeMovies = [
    //     {
    //         key: "1",
    //         poster: "Image1",
    //         description: "Wolvorine vs Deadpool",
    //         duration: 120,
    //         genre: "Action",
    //         language: "English",
    //         releaseDate: "2025-01-05",
    //         name: "Wolverine vs Deadpool",
    //     },
    //     {
    //         key: "2",
    //         poster: "Image2",
    //         description: "Inside Out 2",
    //         duration: 120,
    //         genre: "Animation",
    //         language: "English",
    //         releaseDate: "2025-01-20",
    //         name: "Inside Out 2",
    //     },
    // ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [movies, setMovies]  = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [formType, setFormType] = useState("add");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const dispatch = useDispatch();
    
    const tableHeadings = [
        {
            title: "Poster",
            dataIndex: "poster",
            render: (text, data) =>{
                return (
                    <img width="75" height="115" style={{objectFit: "cover"}} src={data.poster}></img>
                )
            }
        },
        {
            title: "Movie Name",
            dataIndex: "title",
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Duration",
            dataIndex: "duration",
            render: (text)=>{
                return `${text} Min`
            },
        },
        {
            title: "Genre",
            dataIndex: "genre",
        },
        {
            title: "Movie Name",
            dataIndex: "name",
        },
        {
            title: "Language",
            dataIndex: "language",
        },
        {
            title: "Release Date",
            dataIndex: "releaseDate",
            render: (text, data) =>{
                return moment(data.releaseDate).format("MM-DD-YYYY");
            },
        },
        {
            title: "Action",
            render: (text, data) =>{
                return (
                    <div>
                        <Button onClick={()=>{
                            setIsModalOpen(true);
                            setSelectedMovie(data);
                            setFormType("edit")
                        }}>
                            <EditOutlined></EditOutlined>
                        </Button>
                        <Button onClick={()=>{
                            setIsDeleteModalOpen(true);
                            setSelectedMovie(data);
                        }}>
                            <DeleteOutlined></DeleteOutlined>
                        </Button>
                    </div>
                );
            },
        },
    ];

    const getData = async () =>{
        dispatch(ShowLoading());
        const response =  await getAllMovies();
        const allMovies = response.data;
        setMovies(
            allMovies.map((item)=>{
                return {...item, key: `movie${item._id}`}
            })
        );
        dispatch(HideLoading());
    };

    useEffect(()=>{
        getData();
    },[]);

  return (
    <div>
        <div className='d-flex justify-content-end'>
            <Button onClick={() =>{
                setIsModalOpen(true);
                setFormType("add");
            }}>Add Movie</Button>
        </div>
        <Table dataSource={movies} columns={tableHeadings}></Table>
        {isModalOpen && (<MovieForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
            selectedMovie={selectedMovie} formType={formType} setSelectedMovie={setSelectedMovie} getData={getData}></MovieForm>)}
        {isDeleteModalOpen && (<DeleteMovieModal isDeleteModalOpen={isDeleteModalOpen}
            selectedMovie={selectedMovie} setIsDeleteModalOpen={setIsDeleteModalOpen}
            setSelectedMovie={setSelectedMovie} getData = {getData}></DeleteMovieModal>)}
    </div>
  )
}

export default MovieList;