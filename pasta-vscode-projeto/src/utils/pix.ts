import QRCode from 'qrcode';
import { PIX_CHAVE_PADRAO, PIX_BENEFICIARIO, PIX_CIDADE } from '../constants';

/**
 * Formata um campo no padrão EMV TLV (Tag, Length, Value)
 */
function formatEMV(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Cálculo oficial de CRC16-CCITT (Polinômio 0x1021, valor inicial 0xFFFF)
 * Utilizado pelo Banco Central do Brasil para validação do Pix Copia e Cola.
 */
export function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Normaliza strings para formato compatível com o padrão EMV Pix (ASCII sem acentos)
 */
function sanitizeAscii(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim();
}

export interface PixPayloadOptions {
  chave?: string;
  beneficiario?: string;
  cidade?: string;
  valor?: number | null;
  txId?: string;
  descricao?: string;
}

/**
 * Gera o código "Pix Copia e Cola" oficial (BR Code)
 */
export function generatePixPayload(options: PixPayloadOptions = {}): string {
  const chave = options.chave || PIX_CHAVE_PADRAO;
  const rawBeneficiario = options.beneficiario || PIX_BENEFICIARIO;
  const beneficiario = sanitizeAscii(rawBeneficiario).slice(0, 25).toUpperCase() || 'PASSOS EXPRESS';
  const rawCidade = options.cidade || PIX_CIDADE;
  const cidade = sanitizeAscii(rawCidade).slice(0, 15).toUpperCase() || 'CRICIUMA';
  
  // Tag 00 - Payload Format Indicator (01)
  let payload = formatEMV('00', '01');

  // Tag 26 - Merchant Account Information (Pix)
  let merchantInfo = formatEMV('00', 'br.gov.bcb.pix');
  merchantInfo += formatEMV('01', chave);
  if (options.descricao) {
    const descClean = sanitizeAscii(options.descricao).slice(0, 40);
    if (descClean) {
      merchantInfo += formatEMV('02', descClean);
    }
  }
  payload += formatEMV('26', merchantInfo);

  // Tag 52 - Merchant Category Code
  payload += formatEMV('52', '0000');

  // Tag 53 - Transaction Currency (986 = BRL Real)
  payload += formatEMV('53', '986');

  // Tag 54 - Transaction Amount (opcional, só adiciona se tiver valor)
  if (options.valor !== undefined && options.valor !== null && options.valor > 0) {
    const valorStr = options.valor.toFixed(2);
    payload += formatEMV('54', valorStr);
  }

  // Tag 58 - Country Code
  payload += formatEMV('58', 'BR');

  // Tag 59 - Merchant Name
  payload += formatEMV('59', beneficiario);

  // Tag 60 - Merchant City
  payload += formatEMV('60', cidade);

  // Tag 62 - Additional Data Field Template (TxID)
  const rawTxId = options.txId ? sanitizeAscii(options.txId).replace(/\s/g, '').slice(0, 25) : '***';
  const txId = rawTxId || '***';
  const additionalData = formatEMV('05', txId);
  payload += formatEMV('62', additionalData);

  // Tag 63 - CRC16 (Calculado sobre toda a string + '6304')
  payload += '6304';
  const crc = calculateCRC16(payload);

  return `${payload}${crc}`;
}

/**
 * Converte um payload Pix em um QR Code no formato Data URL (imagem base64 PNG)
 */
export async function generatePixQrCode(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Erro ao renderizar QRCode Pix:', err);
    throw err;
  }
}

/**
 * Formata chave para visualização amigável
 */
export function formatDisplayPixKey(chave: string): string {
  // Se for telefone celular brasileiro com 11 dígitos
  const digits = chave.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return chave;
}
