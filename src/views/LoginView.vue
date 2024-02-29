<template>
    <div :class="$style.index">
        <div :class="$style.loginBox">
            <div :class="$style.idPwWrap">
                <div :class="$style.idInput">
                <input 
                    v-model="id"
                    type="id"
                    placeholder="아이디 입력"
                    required
                >
                </div>
                <div :class="$style.pwInput">
                <input 
                    v-model="pw"
                    type="password"
                    placeholder="비밀번호 입력"
                    required
                />
                </div>
            </div>
            <div 
                @click="submit"
                :class="$style.loginButton"
            >
                로그인
            </div>
        </div>
        <div :class="$style.navigator">
            <div :class="$style.navBox">
                <a href="#">비밀번호 찾기</a>
            </div>
            <div :class="$style.navBox">
                <a href="#">아이디 찾기</a>
            </div>
            <div :class="$style.navBox">
                <router-link to="signView">회원가입</router-link>
            </div>
        </div>
    </div>
    
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useLoginStore } from '../stores/counter.js'
import axios from '../axios';

const loginStore = useLoginStore()
const router = useRouter()

const id = ref(null)
const pw = ref(null)

const submit = async () => { 
    try {
        if (!id.value?.trim() || !pw.value?.trim()) {
            alert("아이디와 비밀번호는 필수 요소입니다.")
            return
        }

        const response = await axios.post("/login", {
            id: id.value,
            pw: pw.value,
        });
        
        if (response.status === 200) {
            const userInfo = response.data.userInfo
                loginStore.login(userInfo)
                localStorage.setItem('token', response.data.token)
                router.push('/boardView');
            alert("로그인이 성공했습니다.");
        }
    } catch (error) { 
        alert(`오류가 발생했습니다: ${error.message}, ${error.response?.data.message}`)
    }
}
</script>

<style lang="scss" module>
.index {
    .loginBox {
        width: 500px;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        border: 1px solid #c6c6c6;
        border-radius: 6px;
        box-shadow: 0 5px 8px 0 rgba(68,68,68,.04);

        padding: 35px 0px;

        .idPwWrap {

            .idInput {
                border-radius: 6px 6px 0 0;
                position: relative;
                z-index: 1;
            }

            .pwInput {
                border-radius: 0 0 6px 6px;
                box-shadow: 0 2px 6px 0 rgba(68,68,68,.08);

                position: relative;
                z-index: 1;
                
                margin-top: -1px;
            }
            .idInput, .pwInput {
                width: 402px;
                height: 48px;

                display: flex;
                align-items: center;

                border: 1px solid #dadada;

                padding: 14px 17px 13px;

                &:focus-within {
                    border: 1px solid #1a70dc;
                    z-index: 2;
                }
            
                > input {
                    border: none;

                    &:focus {
                        outline: none;
                    }
                }
            }
        }

        .loginButton {
            width: 402px;
            height: 48px;

            background-color: #1a70dc;

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
}
</style>