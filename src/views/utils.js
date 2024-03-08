import axios from '../axios'

export const getBoardList = async () => { 
    try {
        const response = await axios.get("/getBoardList")
        if (response.status !== 200) return alert("게시판 목록 로드를 시도 중 오류가 발생했습니다: `${response.statusText}`")
        return (response.data)
    } catch (error) { 
        console.error(error)
        alert(`게시판 목록을 불러오지 못했습니다: ${error.message}`)
    }
}

