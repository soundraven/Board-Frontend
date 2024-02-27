import axios from 'axios'

export const getBoardList = async () => { 
    try {
        const response = await axios.get("http://localhost:3000/getBoardList")
        return(response.data)
    } catch (error) { 
        console.error(error)
        alert(`게시판 목록을 불러오지 못했습니다: ${error.message}`)
    }
}