//https://paiza.jp/career/challenges/506/retry
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		// TODO 自動生成されたメソッド・スタブ
		int h,w,n;
		
		Scanner sc = new Scanner(System.in);
		h = sc.nextInt();
		w = sc.nextInt();
		n = sc.nextInt();
		char[][][] cell = new char[h+2][w+2][n+1];
		char[][] out = new char[h +2][w + 2];
		sc.nextLine();
		String line = "";
		//入力
		for(int i = 0; i < h+2;i++){
		    cell[i][0][0] = '$';
		    out[i][w+1] = '$';
		}
		
		for(int j = 0; j < w+2;j++){
		    cell[0][j][0] = '$';
		    out[h+1][j] = '$';
		}
		for(int i = 1;i < h+1;i++) {
		    line = sc.nextLine();
		        for(int j =1;j < w+1;j++){
		            cell[i][j][0] = line.charAt(j-1);
		            
		        }
		    }
		
		
		
		
		
		
		
		
		//オペレーション
		char[] ope = new char[n];
		String opeStr = sc.nextLine();
		for(int i = 0;i < n;i++) {
			ope[i] = opeStr.charAt(i);
		}
		//上下左右に黒あるなら、塗りつぶし
		for(int i = 1;i <= n;i++) {
		    for(int j = 0; j < h + 2;j++) {
					for(int k = 0; k < w + 2;k++) {
					    
					        cell[j][k][i] = cell[j][k][i-1];
					}
		    }
			if(ope[i-1] == 'D') {
				for(int j = 0; j < h + 2;j++) {
					for(int k = 0; k < w + 2;k++) {
						if(cell[j][k][i-1] == '.') {
						    if(k-1 == -1 || j-1 == -1 
						    || k  >= w+1 || j  >= h + 1  ){
						        continue;
						    }
							if(cell[j-1][k][i-1] == '#'
									|| cell[j+1][k][i-1] == '#'
									|| cell[j][k-1][i-1] == '#'
									|| cell[j][k+1][i-1] == '#') {
								
								cell[j][k][i] = '#';
								//System.out.println(cell[j][k]);
							} 
						}
						
					}
				}
			}
			else if(ope[i-1] == 'E') {
				for(int j = 0; j < h +2;j++) {
					for(int k = 0; k < w + 2;k++) {
						if(cell[j][k][i-1] == '#') {
						    if(k-1 == -1 || j-1 == -1 
						    || k >= w+1 || j >= h+1  ){
						        
						        continue;
						    }
						    //最初の画素で決める
							if(cell[j-1][k][i-1] == '.'
								|| cell[j+1][k][i-1] == '.'
								|| cell[j][k-1][i-1] == '.'
								|| cell[j][k+1][i-1] == '.') {
								cell[j][k][i] = '.';
								//System.out.println(cell[j][k]);
							} 
						}
						
					}
				}
			}
			
			
		}
	//出力
		for(int i = 1;i < h+1;i++) {
			for(int j = 1;j < w+1;j++) {
				System.out.print(cell[i][j][n]);
			}
			System.out.println();
		}
	

	}

}
