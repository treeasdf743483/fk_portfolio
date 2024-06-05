 package JavaSimu;

public class MOEAIR extends ConstList{
	private static final double delt =0.01,b=3,m=1,cntMax=100;
	public static void main(String[] args) {
		double [] x = new double [4];
		double [] f = new double[4];
		double [] k1 = new double[4];
		double [] k2 = new double[4];
		double [] k3 = new double[4];
		double [] k4 = new double[4];
		System.out.println("x:"+"\t"+"y:"+"\t"+"vx:"+"\t"+"vy");
		int cnt = 1;
		x[0]=50;
		x[1]=300;
		x[2]=10;
		x[3]=10;
		while(cnt <= cntMax) {
		for(int i = 0;i < 4 ;i++)
		{
		k1[i] = delt*f[i]/6;
		x[i] = x[i]+ delt*k1[i]*0.5;
		MOEAIR f_in = new MOEAIR();
		f[i] = f_in.f_in(f,x,i);
		k2[i] = delt*f[i]/3;
		x[i] = x[i]+ delt*k2[i]*0.5;
		f[i] = f_in.f_in(f,x,i);
		k3[i] = delt*f[i]/3;
		x[i] = x[i]+ delt*k3[i];
		f[i] = f_in.f_in(f,x,i);
		k4[i] = delt*f[i]/6;

		x[i] = x[i] + k1[i]+k2[i]+k3[i]+k4[i];

	}
	cnt++;

	System.out.println(x[0]+"\t"+x[1]+"\t"+x[2]+"\t"+x[3]);
		}


}
private double f_in(double[] f,double[] x,int i) {
	f[0]=x[2];
	f[1]=x[3];
	if(x[2] >=0) {
		f[2]=-b*x[2]*x[2];

	}else{
			f[2]=b*x[2]*x[2];
	}
	if(x[3] >=0){
			f[3]=-m*g-b*x[3]*x[3];
	}
	else {
		f[3]=-m*g+b*x[3]*x[3];
	}
	return f[i];
}
}
