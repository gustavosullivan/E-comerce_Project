package br.edu.atitus.currencyservice.clients;
import java.util.List;

public class BCBResponse {
    private List<BCBValue> value;

    public List<BCBValue> getValue() { return value; }
    public void setValue(List<BCBValue> value) { this.value = value; }

    public static class BCBValue {
        private Double cotacaoVenda;
        public Double getCotacaoVenda() { return cotacaoVenda; }
        public void setCotacaoVenda(Double cotacaoVenda) { this.cotacaoVenda = cotacaoVenda; }
    }
}