import {useEffect, useRef, useState} from "react";

const DataTable =()=>{
    const [formData, setFormData]=useState({name:"",gender:"",age:""});
    const[ data,setData]=useState([]);
    const [editId,setEditId]=useState(false);
    const [searchTerm,setSearchTerm]=useState("")
    const[currentPage,setCurrentPage]=useState(1)
    const outsideClick=useRef(false);
    const itemsPerPage=10;
    const indexOfLastItem=currentPage*itemsPerPage;
    const indexOfFirstItem=indexOfLastItem-itemsPerPage;
    let filteredItems=data.filter((item)=>item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const filteredData=filteredItems.slice(indexOfFirstItem,indexOfLastItem);

    useEffect(()=>{
        setCurrentPage(1);
    },[searchTerm]);

    useEffect(() => {
        if(!editId) return;
        let selectedItem=document.querySelectorAll(`[id='${editId}']`);
        selectedItem[0].focus();
    },[editId]);

    useEffect(()=>{
        const handleClickOutside=(event)=>{
            if(outsideClick.current && !outsideClick.current.contains(event.target)){
                setEditId(false);
            }
        };
        document.addEventListener("click",handleClickOutside);
        return  ()=>{
            document.removeEventListener("click",handleClickOutside)
        }
    },[]);

    const handleInputChange=(e)=>{
        setFormData({...formData, [e.target.name]: e.target.value})
    };

    const handleAddClick=()=>{
        if(formData.name && formData.gender && formData.age){
            const newItem={
                id:Date.now(),
                name:formData.name,
                gender:formData.gender,
                age:formData.age,
            };
            setData([...data,newItem]);
            setFormData({name:"",gender:"",age:""})
        }
    };

    const handleDelete=(id)=>{
        if(filteredData.length===1 && currentPage!==1){
            setCurrentPage((prev)=>prev-1);
        }
        const updatedList=data.filter((item)=>item.id!== id);
        setData(updatedList);
    };

    const handleEdit=(id,updatedData)=>{
        if(!editId || editId!==id){
            return;
        }
        const updatedList=data.map((item)=>
            item.id===id ? {...item,...updatedData}:item);
        setData(updatedList);
    };

    const handleSearch=(e)=>{
        setSearchTerm(e.target.value);
    };

    const paginate=(pageNumber)=>{
        setCurrentPage(pageNumber)
    }
    return (<div className="container">  {/*so we have two divs one for taking input and other for table*/}
            <div className="add-container">
                <div className="info-container">
                    <input type="text"
                           placeholder="Name"
                           name="name"
                           value={formData.name}
                           onChange={handleInputChange}
                    />
                    <input type="text"
                           placeholder="Gender"
                           name="gender"
                           value={formData.gender}
                           onChange={handleInputChange}
                    />
                    <input type="text"
                           placeholder="Age"
                           name="age"
                           value={formData.age}
                           onChange={handleInputChange}
                    />
                </div>   {/*for info like age name*/}
                <button className="add" onClick={handleAddClick}>ADD</button>
            </div>


            <div className="search-container">
                <input type="text"
                       placeholder="Search by name"
                       value={searchTerm}
                       onChange={handleSearch}
                       className="search-input"
                />
                <table ref={outsideClick}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        filteredData.map((item)=>(
                            <tr key={item.id}>
                                <td id={item.id} contentEditable={editId===item.id} onBlur={(e)=>handleEdit(item.id,{name:e.target.innerText})}>{item.name}
                                </td>

                                <td id={item.id} contentEditable={editId===item.id}  onBlur={(e)=>handleEdit(item.id,{gender:e.target.innerText})}>{item.gender}   </td>
                                <td id={item.id} contentEditable={editId===item.id} onBlur={(e)=>handleEdit(item.id,{age:e.target.innerText})}>{item.age}   </td>
                                <td className="actions">
                                    <button className="edit" onClick={()=>setEditId(item.id)}>
                                        Edit
                                    </button>
                                    <button className="delete"
                                            onClick={()=>handleDelete(item.id)}
                                    >Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                <div className="pagination">
                    {Array.from({length:Math.ceil(filteredItems.length/itemsPerPage)},(_,index)=>(
                        <button key={index+1} onClick={()=>paginate(index+1)}
                                style={{background:currentPage===index+1 && "lightgreen",
                                }}
                        >
                            {index+1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DataTable

