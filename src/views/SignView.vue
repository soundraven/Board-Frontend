<template>
    <div :class="$style.loginBox">
        <div :class="$style.idPwWrap">
            <div :class="$style.input">
            <input 
                v-model="id"
                type="text"
                placeholder="아이디 입력(필수)"
            />
            </div>
            <div :class="$style.input">
            <input 
                v-model="pw"
                type="password"
                placeholder="비밀번호 입력(필수)"
            />
            </div>
            <div :class="$style.input">
            <input 
                v-model="email"
                type="email"
                placeholder="이메일 입력(선택)"
            />
            </div>
            <div :class="$style.input">
            <input 
                v-model="nickname"
                type="nickname"
                placeholder="닉네임 입력(선택)"
            />
            </div>
        </div>
        <div 
            :class="$style.signIn"
            @click="submit"
        >
        회원 가입
        </div>
    </div>
    <div :class="$style.navigator">
        <div :class="$style.navBox">
            <a href="#">비밀번호 찾기</a>
        </div>
        <div :class="$style.navBox">
            <a href="#">아이디 찾기</a>
        </div>
    </div>
</template>

<script setup>
import axios from '../axios';
import { ref } from 'vue'

const id = ref(null)
const pw = ref(null)
const email = ref(null)
const nickname = ref(null)
// eslint-disable-next-line no-unused-vars
const form = ref({
    id: null,
    pw: null,
    email: null,
    nickname: null
})


const submit = async () => { 
    try {
        if (!id.value.trim() || !pw.value.trim()) { 
            alert("아이디와 비밀번호는 필수 요소입니다.")
            return
        }
        const response = await axios.post("/signIn", {
            name: id.value,
            password: pw.value,
            email: email.value,
            nickname: nickname.value,
            // ...form.value
        })

        // 배열,오브젝트 변경감지 방법 확인할 것 

        if (response.status === 200) {
            alert("회원 가입이 성공했습니다.");
        } else {
            alert(`오류가 발생했습니다: ${response.statusText}`);
            // alert(`오류가 발생했습니다: ${response.message}`)
        }
    } catch (error) { 
        alert(`오류가 발생했습니다: ${error.message}, ${error.response.data.message}`)
    }
}
</script>

<style lang="scss" module>

.loginBox {
    width: 460px;
    height: 340px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    border: 1px solid #c6c6c6;
    border-radius: 6px;
    box-shadow: 0 5px 8px 0 rgba(68,68,68,.04);

    margin: 0 auto;
    padding: 35px 0px;

    .idPwWrap {
        padding: 0 0 20px 0;

        .input {
            &:first-of-type {
                border-radius: 6px 6px 0 0;
                margin-top: 0;
            }

            &:last-of-type {
                border: 1px solid #dadada;
                border-radius: 0 0 6px 6px;
                box-shadow: 0 2px 6px 0 rgba(68,68,68,.08);
            }

            width: 402px;
            height: 48px;

            display: flex;
            align-items: center;

            border: 1px solid #dadada;
            border-bottom: 0px;

            padding: 14px 17px 13px;
            z-index: 1;
            margin-top: -1px;
            position: relative;

            box-shadow: 0 0px 2px 0 rgba(68,68,68,.08);

            &:focus-within {
                border: 1px solid #03c75a;
                border-bottom: 1px solid #03c75a;;
                z-index: 2;
            }
        
            > input {
                width: 100%;
                border: none;

                &:focus {
                    outline: none;
                }
            }
        }
    }

    .signIn {
        width: 402px;
        height: 48px;

        background-color: #03c75a;

        color: white;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        line-height: 48px;

        border-radius: 6px;
        box-shadow: 0 2px 6px 0 rgba(68,68,68,.08); 
    }
}

.navigator {
    width: 402px;
    display: flex;
    justify-content: center;
    margin: 20px auto;
    
    .navBox {
        border-right: 1px solid #c6c6c6;
        padding: 0 10px 0 10px;

        a {
            text-decoration: none;
            color: #888;
        }

        &:last-child {
            border-right: none;
        }
    }
}
</style>