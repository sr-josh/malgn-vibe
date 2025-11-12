import { useState } from 'react';
import './Calculator.css';

function CryptoCalculator() {
  const [algorithm, setAlgorithm] = useState('base64');
  const [operation, setOperation] = useState('encrypt');
  const [inputText, setInputText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Base64 인코딩/디코딩
  const base64Encode = (text) => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
      throw new Error('Base64 인코딩 실패');
    }
  };

  const base64Decode = (text) => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (e) {
      throw new Error('Base64 디코딩 실패 (올바른 Base64 문자열이 아닙니다)');
    }
  };

  // MD5 해시 (간단한 구현)
  const md5Hash = (text) => {
    const md5 = (string) => {
      const rotateLeft = (value, shift) => (value << shift) | (value >>> (32 - shift));
      const addUnsigned = (x, y) => {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
      };
      const F = (x, y, z) => (x & y) | (~x & z);
      const G = (x, y, z) => (x & z) | (y & ~z);
      const H = (x, y, z) => x ^ y ^ z;
      const I = (x, y, z) => y ^ (x | ~z);
      const FF = (a, b, c, d, x, s, ac) => {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      };
      const GG = (a, b, c, d, x, s, ac) => {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      };
      const HH = (a, b, c, d, x, s, ac) => {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      };
      const II = (a, b, c, d, x, s, ac) => {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      };
      const convertToWordArray = (string) => {
        let lWordCount;
        const lMessageLength = string.length;
        const lNumberOfWords_temp1 = lMessageLength + 8;
        const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        const lWordArray = Array(lNumberOfWords - 1);
        let lBytePosition = 0;
        let lByteCount = 0;
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
          lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      };
      const wordToHex = (value) => {
        let wordToHexValue = '', wordToHexValue_temp = '', byte, count;
        for (count = 0; count <= 3; count++) {
          byte = (value >>> (count * 8)) & 255;
          wordToHexValue_temp = '0' + byte.toString(16);
          wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
      };
      const uTF8Encode = (string) => {
        string = string.replace(/\r\n/g, '\n');
        let utftext = '';
        for (let n = 0; n < string.length; n++) {
          const c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
        return utftext;
      };
      let x = [], k, AA, BB, CC, DD, a, b, c, d;
      const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
      const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
      const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
      const S41 = 6, S42 = 10, S43 = 15, S44 = 21;
      string = uTF8Encode(string);
      x = convertToWordArray(string);
      a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
      for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
      }
      return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
    };
    return md5(text);
  };

  // SHA-256 해시 (Web Crypto API 사용)
  const sha256Hash = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // AES-256-GCM 암호화
  const aesEncrypt = async (text, password) => {
    if (!password || password.length < 8) {
      throw new Error('비밀키는 최소 8자 이상이어야 합니다');
    }

    try {
      const encoder = new TextEncoder();
      
      // 비밀번호에서 키 생성
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const salt = crypto.getRandomValues(new Uint8Array(16));
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encoder.encode(text)
      );

      // salt + iv + encrypted 데이터를 합쳐서 Base64로 인코딩
      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encrypted), salt.length + iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (e) {
      throw new Error('AES 암호화 실패: ' + e.message);
    }
  };

  // AES-256-GCM 복호화
  const aesDecrypt = async (encryptedBase64, password) => {
    if (!password || password.length < 8) {
      throw new Error('비밀키는 최소 8자 이상이어야 합니다');
    }

    try {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      // Base64 디코딩
      const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

      // salt, iv, encrypted 데이터 분리
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const encrypted = combined.slice(28);

      // 비밀번호에서 키 생성
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encrypted
      );

      return decoder.decode(decrypted);
    } catch (e) {
      throw new Error('AES 복호화 실패 (잘못된 비밀키이거나 손상된 데이터입니다)');
    }
  };

  const handleCalculate = async () => {
    setError('');
    setResult(null);

    if (!inputText.trim()) {
      setError('텍스트를 입력해주세요');
      return;
    }

    try {
      let output = '';
      let resultType = '';

      if (algorithm === 'base64') {
        if (operation === 'encrypt') {
          output = base64Encode(inputText);
          resultType = 'Base64 인코딩';
        } else {
          output = base64Decode(inputText);
          resultType = 'Base64 디코딩';
        }
      } else if (algorithm === 'md5') {
        output = md5Hash(inputText);
        resultType = 'MD5 해시';
      } else if (algorithm === 'sha256') {
        output = await sha256Hash(inputText);
        resultType = 'SHA-256 해시';
      } else if (algorithm === 'aes') {
        if (!secretKey.trim()) {
          setError('AES 암호화/복호화를 위해 비밀키를 입력해주세요');
          return;
        }
        if (operation === 'encrypt') {
          output = await aesEncrypt(inputText, secretKey);
          resultType = 'AES-256 암호화';
        } else {
          output = await aesDecrypt(inputText, secretKey);
          resultType = 'AES-256 복호화';
        }
      }

      setResult({
        type: resultType,
        output: output,
        inputLength: inputText.length,
        outputLength: output.length
      });
    } catch (e) {
      setError(e.message);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSecretKey('');
    setResult(null);
    setError('');
  };

  const handleCopy = () => {
    if (result?.output) {
      navigator.clipboard.writeText(result.output);
      alert('결과가 클립보드에 복사되었습니다');
    }
  };

  return (
    <div className="calculator">
      <div className="calculator-card">
        <h2 className="calculator-title">🔐 암호화/복호화 계산기</h2>
        <p className="calculator-description">
          텍스트를 암호화하거나 복호화합니다
        </p>

        <form className="calculator-form" onSubmit={(e) => { e.preventDefault(); handleCalculate(); }}>
          <div className="form-group">
            <label>알고리즘 선택</label>
            <div className="category-tabs">
              <button
                type="button"
                className={`category-tab ${algorithm === 'base64' ? 'active' : ''}`}
                onClick={() => setAlgorithm('base64')}
              >
                Base64
              </button>
              <button
                type="button"
                className={`category-tab ${algorithm === 'aes' ? 'active' : ''}`}
                onClick={() => setAlgorithm('aes')}
              >
                AES-256
              </button>
              <button
                type="button"
                className={`category-tab ${algorithm === 'md5' ? 'active' : ''}`}
                onClick={() => setAlgorithm('md5')}
              >
                MD5
              </button>
              <button
                type="button"
                className={`category-tab ${algorithm === 'sha256' ? 'active' : ''}`}
                onClick={() => setAlgorithm('sha256')}
              >
                SHA-256
              </button>
            </div>
          </div>

          {algorithm !== 'sha256' && algorithm !== 'md5' && (
            <div className="form-group">
              <label>작업 선택</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="encrypt"
                    checked={operation === 'encrypt'}
                    onChange={(e) => setOperation(e.target.value)}
                  />
                  <span>{algorithm === 'base64' ? '인코딩' : '암호화'}</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="decrypt"
                    checked={operation === 'decrypt'}
                    onChange={(e) => setOperation(e.target.value)}
                  />
                  <span>{algorithm === 'base64' ? '디코딩' : '복호화'}</span>
                </label>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>
              {operation === 'encrypt' || algorithm === 'sha256'
                ? '원본 텍스트'
                : '암호화된 텍스트'}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                operation === 'encrypt' || algorithm === 'sha256'
                  ? '암호화할 텍스트를 입력하세요'
                  : '복호화할 텍스트를 입력하세요'
              }
              rows="5"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #3d3d3d',
                borderRadius: '8px',
                background: '#1a1a1a',
                color: 'white',
                fontSize: '1rem',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
            />
          </div>

          {algorithm === 'aes' && (
            <div className="form-group">
              <label>비밀키 (최소 8자)</label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="비밀키를 입력하세요"
                minLength="8"
              />
              <p style={{ color: '#888', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>
                ⚠️ 복호화 시 암호화할 때 사용한 동일한 비밀키가 필요합니다
              </p>
            </div>
          )}

          {(algorithm === 'md5' || algorithm === 'sha256') && (
            <div style={{ padding: '1rem', background: '#2d2d2d', borderRadius: '8px', marginBottom: '1rem' }}>
              <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>
                ℹ️ {algorithm === 'md5' ? 'MD5' : 'SHA-256'}는 단방향 해시 함수로, 복호화가 불가능합니다
              </p>
              {algorithm === 'md5' && (
                <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>
                  ⚠️ MD5는 보안상 취약하므로 비밀번호 저장 등에는 사용하지 마세요
                </p>
              )}
            </div>
          )}

          {error && (
            <div style={{ padding: '1rem', background: '#2d1f1f', border: '2px solid #e74c3c', borderRadius: '8px' }}>
              <p style={{ color: '#e74c3c', margin: 0 }}>{error}</p>
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              {(algorithm === 'md5' || algorithm === 'sha256') ? '해시 생성' : operation === 'encrypt' ? '암호화' : '복호화'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              초기화
            </button>
          </div>
        </form>

        {result && (
          <div className="result-card">
            <h3 className="result-title">{result.type} 결과</h3>
            
            <div className="result-summary">
              <p className="summary-text">
                입력 길이: <strong>{result.inputLength}자</strong> → 
                출력 길이: <strong>{result.outputLength}자</strong>
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#aaa', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                결과
              </label>
              <textarea
                value={result.output}
                readOnly
                rows="8"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #4a6fa5',
                  borderRadius: '8px',
                  background: '#1a1a1a',
                  color: '#5ba3c7',
                  fontSize: '0.95rem',
                  fontFamily: 'monospace',
                  resize: 'vertical',
                  wordBreak: 'break-all'
                }}
              />
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleCopy}
              style={{ width: '100%' }}
            >
              📋 결과 복사
            </button>

            {algorithm === 'aes' && operation === 'encrypt' && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#2d2d2d', borderRadius: '8px' }}>
                <p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0 }}>
                  💡 이 암호화된 텍스트를 복호화하려면 동일한 비밀키가 필요합니다.
                  비밀키를 안전하게 보관하세요.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CryptoCalculator;
